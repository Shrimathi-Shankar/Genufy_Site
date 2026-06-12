'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

/*
 * Advanced QR Code Generator — ported verbatim from the legacy standalone tool
 * (the old genufy.in/qr-code page). It is a self-contained client-side widget:
 * the QRious library is loaded from a CDN and all generation happens on a
 * <canvas> in the browser (no server round-trip). The imperative DOM logic is
 * kept close to the original and runs once on mount inside an effect; every
 * listener is bound with an AbortController so a single abort() cleans them all
 * up (safe under React Strict Mode's double-invoke in dev).
 */
export default function QrCode() {
  const rootRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    // --- DOM Elements ---
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const sizeInput = document.getElementById('sizeInput');
    const styleSelect = document.getElementById('styleSelect');
    const stylePreview = document.getElementById('stylePreview');
    const colorInput = document.getElementById('colorInput');
    const formatSelect = document.getElementById('formatSelect');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const batchDownloadBtn = document.getElementById('batchDownloadBtn');
    const qrCanvas = document.getElementById('qrCanvas');
    const colorPresets = document.querySelectorAll('.color-preset');

    // Canvas controls
    const copyBtn = document.getElementById('copyBtn');
    const printBtn = document.getElementById('printBtn');
    const shareBtn = document.getElementById('shareBtn');

    if (!generateBtn || !qrCanvas) return;

    // State management
    let currentTab = 'url';
    let currentQRData = null;

    // Initialize
    updateActivePreset('#0b0f14');

    // Tab functionality
    tabs.forEach((tab) => {
      tab.addEventListener(
        'click',
        () => {
          const tabId = tab.getAttribute('data-tab');
          switchTab(tabId);
        },
        { signal }
      );
    });

    function switchTab(tabId) {
      currentTab = tabId;

      tabs.forEach((t) => t.classList.remove('active'));
      tabContents.forEach((tc) => tc.classList.remove('active'));

      document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
      document.getElementById(`${tabId}-content`).classList.add('active');
    }

    // Style selection functionality
    styleSelect.addEventListener(
      'change',
      (e) => {
        updateStylePreview(e.target.value);
        if (currentQRData) regenerateQRCode();
      },
      { signal }
    );

    function updateStylePreview(style) {
      const previewGrid = stylePreview.querySelector('.preview-grid');
      previewGrid.className = `preview-grid ${style}-style`;

      const previewDots = stylePreview.querySelectorAll('.preview-dot');
      previewDots.forEach((dot) => {
        dot.style.backgroundColor = colorInput.value;
      });
    }

    // Color preset functionality
    colorPresets.forEach((preset) => {
      preset.addEventListener(
        'click',
        () => {
          const color = preset.getAttribute('data-color');
          colorInput.value = color;
          updateActivePreset(color);
          if (currentQRData) regenerateQRCode();
        },
        { signal }
      );
    });

    colorInput.addEventListener(
      'change',
      (e) => {
        updateActivePreset(e.target.value);
        if (currentQRData) regenerateQRCode();
      },
      { signal }
    );

    function updateActivePreset(color) {
      colorPresets.forEach((preset) => {
        preset.classList.remove('active');
        if (preset.getAttribute('data-color') === color) {
          preset.classList.add('active');
        }
      });
      updateStylePreview(styleSelect.value);
    }

    // QR Code generation
    generateBtn.addEventListener('click', generateQRCode, { signal });

    function generateQRCode() {
      const QRious = window.QRious;
      if (!QRious) {
        showNotification('QR library still loading, please try again', 'error');
        return;
      }

      const qrData = getQRData();
      if (!qrData) return;

      const size = parseInt(sizeInput.value) || 300;
      const color = colorInput.value;
      const style = styleSelect.value;

      generateBtn.textContent = 'Generating...';
      generateBtn.disabled = true;

      setTimeout(() => {
        try {
          const qr = new QRious({
            value: qrData,
            size: size,
            backgroundAlpha: 1,
            foreground: color,
            background: '#ffffff',
            level: 'H',
          });

          qrCanvas.width = size;
          qrCanvas.height = size;

          const context = qrCanvas.getContext('2d');
          const img = new Image();
          img.onload = () => {
            context.clearRect(0, 0, size, size);

            if (style === 'square') {
              context.drawImage(img, 0, 0, size, size);
            } else {
              applyQRStyle(context, img, size, style, color);
            }

            // Store current QR data
            currentQRData = {
              data: qrData,
              size: size,
              color: color,
              style: style,
              type: currentTab,
              timestamp: new Date().toISOString(),
            };

            // Enable controls
            enableQRControls();

            showNotification('QR Code generated successfully!', 'success');
          };
          img.src = qr.toDataURL();
        } catch (error) {
          showNotification('Error generating QR code: ' + error.message, 'error');
        } finally {
          generateBtn.textContent = 'Generate QR Code';
          generateBtn.disabled = false;
        }
      }, 300);
    }

    function regenerateQRCode() {
      const QRious = window.QRious;
      if (!currentQRData || !QRious) return;

      const size = parseInt(sizeInput.value) || currentQRData.size;
      const color = colorInput.value;
      const style = styleSelect.value;

      const qr = new QRious({
        value: currentQRData.data,
        size: size,
        backgroundAlpha: 1,
        foreground: color,
        background: '#ffffff',
        level: 'H',
      });

      qrCanvas.width = size;
      qrCanvas.height = size;

      const context = qrCanvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, size, size);

        if (style === 'square') {
          context.drawImage(img, 0, 0, size, size);
        } else {
          applyQRStyle(context, img, size, style, color);
        }

        // Update current QR data
        currentQRData.size = size;
        currentQRData.color = color;
        currentQRData.style = style;
      };
      img.src = qr.toDataURL();
    }

    function getQRData() {
      switch (currentTab) {
        case 'url': {
          const url = document.getElementById('urlInput').value.trim();
          if (!url) {
            showNotification('Please enter a URL', 'error');
            return null;
          }
          return url.startsWith('http') ? url : 'https://' + url;
        }

        case 'text': {
          const text = document.getElementById('textInput').value.trim();
          if (!text) {
            showNotification('Please enter some text', 'error');
            return null;
          }
          return text;
        }

        case 'contact': {
          const name = document.getElementById('contactName').value.trim();
          const phone = document.getElementById('contactPhone').value.trim();
          const email = document.getElementById('contactEmail').value.trim();
          const org = document.getElementById('contactOrg').value.trim();
          const title = document.getElementById('contactTitle').value.trim();
          const address = document.getElementById('contactAddress').value.trim();

          if (!name && !phone && !email) {
            showNotification('Please enter at least name, phone, or email', 'error');
            return null;
          }

          let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
          if (name) vcard += `FN:${name}\n`;
          if (phone) vcard += `TEL:${phone}\n`;
          if (email) vcard += `EMAIL:${email}\n`;
          if (org) vcard += `ORG:${org}\n`;
          if (title) vcard += `TITLE:${title}\n`;
          if (address) vcard += `ADR:;;${address};;;;\n`;
          vcard += 'END:VCARD';
          return vcard;
        }

        case 'wifi': {
          const ssid = document.getElementById('wifiSSID').value.trim();
          const password = document.getElementById('wifiPassword').value;
          const security = document.getElementById('wifiSecurity').value;
          const hidden = document.getElementById('wifiHidden').checked;

          if (!ssid) {
            showNotification('Please enter WiFi network name', 'error');
            return null;
          }

          return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};`;
        }

        case 'email': {
          const emailTo = document.getElementById('emailTo').value.trim();
          const subject = document.getElementById('emailSubject').value.trim();
          const body = document.getElementById('emailBody').value.trim();

          if (!emailTo) {
            showNotification('Please enter recipient email', 'error');
            return null;
          }

          let emailData = `mailto:${emailTo}`;
          const params = [];
          if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
          if (body) params.push(`body=${encodeURIComponent(body)}`);
          if (params.length > 0) emailData += '?' + params.join('&');

          return emailData;
        }

        default:
          return null;
      }
    }

    function applyQRStyle(context, img, size, style, color) {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = size;
      tempCanvas.height = size;
      tempCtx.drawImage(img, 0, 0, size, size);

      const imageData = tempCtx.getImageData(0, 0, size, size);
      const data = imageData.data;

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, size, size);
      context.fillStyle = color;

      const moduleSize = size / 25;

      for (let y = 0; y < size; y += Math.floor(moduleSize)) {
        for (let x = 0; x < size; x += Math.floor(moduleSize)) {
          const pixelIndex = (y * size + x) * 4;
          if (data[pixelIndex] < 128) {
            drawStyledModule(context, x, y, Math.floor(moduleSize), style);
          }
        }
      }
    }

    function drawStyledModule(context, x, y, moduleSize, style) {
      const centerX = x + moduleSize / 2;
      const centerY = y + moduleSize / 2;

      switch (style) {
        case 'rounded':
          context.beginPath();
          if (context.roundRect) {
            context.roundRect(x + 1, y + 1, moduleSize - 2, moduleSize - 2, moduleSize * 0.2);
          } else {
            context.rect(x + 1, y + 1, moduleSize - 2, moduleSize - 2);
          }
          context.fill();
          break;

        case 'dots': {
          const dotSize = moduleSize * 0.7;
          context.fillRect(centerX - dotSize / 2, centerY - dotSize / 2, dotSize, dotSize);
          break;
        }

        case 'circular':
          context.beginPath();
          context.arc(centerX, centerY, moduleSize * 0.4, 0, 2 * Math.PI);
          context.fill();
          break;

        default:
          context.fillRect(x, y, moduleSize, moduleSize);
      }
    }

    function enableQRControls() {
      downloadBtn.disabled = false;
      batchDownloadBtn.disabled = false;
      copyBtn.disabled = false;
      printBtn.disabled = false;
      shareBtn.disabled = false;
    }

    // Download functionality
    downloadBtn.addEventListener('click', downloadQRCode, { signal });

    function downloadQRCode() {
      if (!currentQRData) return;

      const format = formatSelect.value;
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `genufy-qr-${currentTab}-${timestamp}`;

      link.download = `${filename}.${format}`;

      if (format === 'svg') {
        // Generate SVG
        const svgData = generateSVGQR(currentQRData);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        link.href = URL.createObjectURL(blob);
      } else if (format === 'jpeg') {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = qrCanvas.width;
        tempCanvas.height = qrCanvas.height;

        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(qrCanvas, 0, 0);

        link.href = tempCanvas.toDataURL('image/jpeg', 0.95);
      } else {
        link.href = qrCanvas.toDataURL('image/png');
      }

      link.click();
      showNotification('QR Code downloaded successfully!', 'success');
    }

    function generateSVGQR(qrData) {
      const QRious = window.QRious;
      const qr = new QRious({
        value: qrData.data,
        size: qrData.size,
        level: 'H',
      });

      // Convert canvas to SVG (simplified version)
      const size = qrData.size;
      const moduleSize = size / 25;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
      svg += `<rect width="${size}" height="${size}" fill="white"/>`;

      // This is a simplified SVG generation - in a real implementation,
      // you'd need to properly decode the QR matrix
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(qr.canvas, 0, 0);

      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;

      for (let y = 0; y < size; y += Math.floor(moduleSize)) {
        for (let x = 0; x < size; x += Math.floor(moduleSize)) {
          const pixelIndex = (y * size + x) * 4;
          if (data[pixelIndex] < 128) {
            if (qrData.style === 'circular') {
              const centerX = x + moduleSize / 2;
              const centerY = y + moduleSize / 2;
              const radius = moduleSize * 0.4;
              svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="${qrData.color}"/>`;
            } else {
              const modSize = Math.floor(moduleSize);
              const rx = qrData.style === 'rounded' ? moduleSize * 0.2 : 0;
              svg += `<rect x="${x}" y="${y}" width="${modSize}" height="${modSize}" rx="${rx}" fill="${qrData.color}"/>`;
            }
          }
        }
      }

      svg += '</svg>';
      return svg;
    }

    // Copy to clipboard
    copyBtn.addEventListener(
      'click',
      async () => {
        try {
          const canvas = qrCanvas;
          canvas.toBlob(async (blob) => {
            try {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
              showNotification('QR Code copied to clipboard!', 'success');
            } catch (err) {
              showNotification('Failed to copy to clipboard', 'error');
            }
          });
        } catch (err) {
          showNotification('Clipboard not supported', 'error');
        }
      },
      { signal }
    );

    // Print functionality
    printBtn.addEventListener(
      'click',
      () => {
        const printWindow = window.open('', '_blank');
        const imgData = qrCanvas.toDataURL();

        printWindow.document.write(`
                <html>
                    <head><title>Print QR Code</title></head>
                    <body style="text-align: center; padding: 20px;">
                        <h2>QR Code</h2>
                        <img src="${imgData}" style="max-width: 100%; height: auto;">
                        <p>Generated by Genufy QR Generator</p>
                    </body>
                </html>
            `);

        printWindow.document.close();
        printWindow.print();
      },
      { signal }
    );

    // Share functionality
    shareBtn.addEventListener(
      'click',
      async () => {
        if (navigator.share) {
          try {
            qrCanvas.toBlob(async (blob) => {
              const file = new File([blob], 'qr-code.png', { type: 'image/png' });
              await navigator.share({
                title: 'QR Code',
                text: 'Check out this QR code!',
                files: [file],
              });
            });
          } catch (err) {
            showNotification('Sharing failed', 'error');
          }
        } else {
          // Fallback: copy URL to clipboard
          const imgData = qrCanvas.toDataURL();
          navigator.clipboard.writeText(imgData).then(() => {
            showNotification('QR Code data copied to clipboard!', 'success');
          });
        }
      },
      { signal }
    );

    // Batch download functionality
    batchDownloadBtn.addEventListener(
      'click',
      () => {
        showNotification('Batch download feature coming soon!', 'success');
      },
      { signal }
    );

    // Utility functions
    function showNotification(message, type) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.className = `notification ${type}`;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('show');
      }, 100);

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }

    function setInitialCanvasSize() {
      const screenWidth = window.innerWidth;
      let initialSize = 300;

      if (screenWidth < 768) {
        initialSize = Math.min(250, screenWidth - 120);
      }

      sizeInput.value = initialSize;
      qrCanvas.width = initialSize;
      qrCanvas.height = initialSize;
    }

    // Keyboard shortcuts
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case 'Enter':
              e.preventDefault();
              if (!generateBtn.disabled) generateBtn.click();
              break;
            case 's':
              e.preventDefault();
              if (!downloadBtn.disabled) downloadBtn.click();
              break;
            case 'c':
              if (e.shiftKey) {
                e.preventDefault();
                if (!copyBtn.disabled) copyBtn.click();
              }
              break;
            default:
              break;
          }
        }
      },
      { signal }
    );

    // Initialize canvas size
    setInitialCanvasSize();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setInitialCanvasSize, 250);
      },
      { signal }
    );

    return () => {
      controller.abort();
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div className="qr-page" ref={rootRef}>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"
        strategy="afterInteractive"
      />

      <div className="aurora-layer" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="main-container">
        <div className="container">
          <div className="header">
            <div className="title-container">
              <h1>QR Generator Pro</h1>
              <div className="subtitle">Advanced QR Code Solutions</div>
            </div>
          </div>

          <div className="tab-container">
            <div className="tabs">
              <button className="tab active" data-tab="url">URL</button>
              <button className="tab" data-tab="text">Text</button>
              <button className="tab" data-tab="contact" style={{ display: 'none' }}>Contact</button>
              <button className="tab" data-tab="wifi">WiFi</button>
              <button className="tab" data-tab="email">Email</button>
            </div>

            <div className="tab-content active" id="url-content">
              <div className="input-group">
                <label htmlFor="urlInput">Website URL</label>
                <input type="url" id="urlInput" placeholder="https://example.com" />
              </div>
            </div>

            <div className="tab-content" id="text-content">
              <div className="input-group">
                <label htmlFor="textInput">Plain Text</label>
                <textarea id="textInput" placeholder="Enter any text content..." />
              </div>
            </div>

            <div className="tab-content" id="contact-content">
              <div className="input-group">
                <label htmlFor="contactName">Full Name</label>
                <input type="text" id="contactName" placeholder="John Doe" />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="contactPhone">Phone</label>
                  <input type="tel" id="contactPhone" placeholder="+1234567890" />
                </div>
                <div className="input-group">
                  <label htmlFor="contactEmail">Email</label>
                  <input type="email" id="contactEmail" placeholder="john@example.com" />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="contactOrg">Organization</label>
                  <input type="text" id="contactOrg" placeholder="Company Name" />
                </div>
                <div className="input-group">
                  <label htmlFor="contactTitle">Job Title</label>
                  <input type="text" id="contactTitle" placeholder="Position" />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="contactAddress">Address</label>
                <textarea id="contactAddress" placeholder="123 Main St, City, Country" />
              </div>
            </div>

            <div className="tab-content" id="wifi-content">
              <div className="input-group">
                <label htmlFor="wifiSSID">Network Name (SSID)</label>
                <input type="text" id="wifiSSID" placeholder="MyWiFiNetwork" />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="wifiPassword">Password</label>
                  <input type="password" id="wifiPassword" placeholder="WiFi password" />
                </div>
                <div className="input-group">
                  <label htmlFor="wifiSecurity">Security Type</label>
                  <select id="wifiSecurity">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Open (No Password)</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>
                  <input type="checkbox" id="wifiHidden" /> Hidden Network
                </label>
              </div>
            </div>

            <div className="tab-content" id="email-content">
              <div className="input-group">
                <label htmlFor="emailTo">Recipient Email</label>
                <input type="email" id="emailTo" placeholder="recipient@example.com" />
              </div>
              <div className="input-group">
                <label htmlFor="emailSubject">Subject</label>
                <input type="text" id="emailSubject" placeholder="Email subject" />
              </div>
              <div className="input-group">
                <label htmlFor="emailBody">Message Body</label>
                <textarea id="emailBody" placeholder="Your message here..." />
              </div>
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="sizeInput">Size (pixels)</label>
              <input type="number" id="sizeInput" placeholder="300" min="100" max="1000" defaultValue="300" />
            </div>
            <div className="input-group">
              <label htmlFor="formatSelect">Export Format</label>
              <select id="formatSelect">
                <option value="png">PNG (Recommended)</option>
                <option value="jpeg">JPEG</option>
                <option value="svg">SVG Vector</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="styleSelect">QR Code Style</label>
            <div className="style-selector">
              <select id="styleSelect">
                <option value="square">Classic Square</option>
                <option value="rounded">Rounded Corners</option>
                <option value="dots">Dots Pattern</option>
                <option value="circular">Circular Dots</option>
              </select>
              <div className="style-preview" id="stylePreview">
                <div className="preview-grid square-style">
                  <div className="preview-dot" />
                  <div className="preview-dot" />
                  <div className="preview-dot" />
                  <div className="preview-dot" />
                </div>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="colorInput">QR Code Color</label>
            <div className="color-picker-container">
              <div className="colors">
                <input type="color" id="colorInput" defaultValue="#0b0f14" />
                <div className="color-picker">
                  <div className="picker" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5de0d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m2 22 1-1h3l9-9" />
                      <path d="M3 21v-3l9-9" />
                      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="color-presets">
                <button type="button" className="color-preset" data-color="#0b0f14" style={{ backgroundColor: '#0b0f14' }} title="Genufy Ink" />
                <button type="button" className="color-preset" data-color="#000000" style={{ backgroundColor: '#000000' }} title="Classic Black" />
                <button type="button" className="color-preset" data-color="#24baac" style={{ backgroundColor: '#24baac' }} title="Genufy Teal" />
                <button type="button" className="color-preset" data-color="#90eb61" style={{ backgroundColor: '#90eb61' }} title="Genufy Lime" />
                <button type="button" className="color-preset" data-color="#2563eb" style={{ backgroundColor: '#2563eb' }} title="Blue" />
                <button type="button" className="color-preset" data-color="#7c3aed" style={{ backgroundColor: '#7c3aed' }} title="Purple" />
              </div>
            </div>
          </div>

          <button className="generate-btn" id="generateBtn">Generate QR Code</button>
        </div>
        <div className="container1">
          <div className="canvas-container">
            <div className="canvas-controls">
              <button className="canvas-btn" id="copyBtn" disabled>Copy to Clipboard</button>
              <button className="canvas-btn" id="printBtn" disabled>Print QR Code</button>
              <button className="canvas-btn" id="shareBtn" disabled>Share</button>
            </div>
            <canvas id="qrCanvas" width="300" height="300" />
            <div className="download-section">
              <button className="download-btn primary" id="downloadBtn" disabled>Download QR Code</button>
              <button className="download-btn" id="batchDownloadBtn" disabled>Batch Download</button>
            </div>
          </div>
        </div>
      </div>
      <footer>Powered by Genufy TechWorks</footer>

      <style jsx>{`
        .qr-page {
          font-family: var(--font-inter), 'Inter', sans-serif;
          background:
            radial-gradient(120% 80% at 50% -10%, rgba(36, 186, 172, 0.08) 0%, transparent 55%),
            linear-gradient(180deg, #05070a 0%, #000000 60%);
          min-height: 100vh;
          color: #ffffff;
          position: relative;
          overflow-x: hidden;
        }

        .main-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;
          padding: 40px 30px;
          min-height: 100vh;
          flex-direction: row;
          position: relative;
          z-index: 1;
        }

        .container {
          width: 100%;
          max-width: 550px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 30px 40px;
          border-radius: 24px;
          border: 1px solid rgba(144, 235, 97, 0.15);
          box-shadow:
            0 0 0 1px rgba(144, 235, 97, 0.08),
            0 10px 60px -10px rgba(36, 186, 172, 0.45);
          position: relative;
          overflow: hidden;
        }

        .container1 {
          width: 100%;
          max-width: 550px;
        }

        .container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #90eb61, #24baac, #5de0d4, #24baac, #90eb61);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .header {
          margin-bottom: 32px;
          position: relative;
        }

        .title-container {
          text-align: center;
        }

        h1 {
          font-family: var(--font-space), var(--font-inter), sans-serif;
          font-size: clamp(28px, 6vw, 36px);
          font-weight: 700;
          background: linear-gradient(90deg, #90eb61, #24baac);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .tab-container {
          margin-bottom: 24px;
        }

        .tabs {
          display: flex;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 4px;
          border-radius: 12px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          text-align: center;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.6);
        }

        .tab.active {
          background: linear-gradient(135deg, #90eb61, #24baac);
          color: #05070a;
          font-weight: 600;
          box-shadow: 0 2px 12px rgba(36, 186, 172, 0.4);
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }

        .input-group {
          margin-bottom: 20px;
          position: relative;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.75);
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        input,
        select,
        textarea {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-inter), 'Inter', sans-serif;
        }

        select option {
          background: #05070a;
          color: #ffffff;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #24baac;
          background: rgba(255, 255, 255, 0.06);
          box-shadow:
            0 0 0 3px rgba(36, 186, 172, 0.15),
            0 8px 20px -5px rgba(36, 186, 172, 0.2);
          transform: translateY(-1px);
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .colors {
          display: flex;
          width: 100%;
          gap: 5px;
        }

        input[type='color'] {
          width: 75%;
          height: 50px;
          padding: 6px;
          cursor: pointer;
          border-radius: 10px;
        }

        .color-picker {
          width: 100%;
          max-width: 40px;
          border-radius: 10px;
          border: rgba(255, 255, 255, 0.12) 2px solid;
          background: rgba(255, 255, 255, 0.04);
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .picker {
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        input[type='color']::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        input[type='color']::-webkit-color-swatch {
          border: none;
          border-radius: 6px;
        }

        .color-picker-container {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .color-presets {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .color-preset {
          width: 28px;
          height: 28px;
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .color-preset:hover {
          transform: scale(1.1);
          border-color: #24baac;
          box-shadow: 0 4px 12px rgba(36, 186, 172, 0.35);
        }

        .color-preset.active {
          border-color: #90eb61;
          border-width: 3px;
          transform: scale(1.05);
        }

        .color-preset.active::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }

        .style-selector {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .style-preview {
          min-width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.92);
          border: 2px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3px;
          width: 24px;
          height: 24px;
        }

        .preview-dot {
          background-color: #0b0f14;
          transition: all 0.3s ease;
        }

        .square-style .preview-dot {
          border-radius: 0;
        }

        .rounded-style .preview-dot {
          border-radius: 2px;
        }

        .dots-style .preview-dot {
          border-radius: 1px;
          transform: scale(0.8);
        }

        .circular-style .preview-dot {
          border-radius: 50%;
          transform: scale(0.9);
        }

        .generate-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #90eb61, #24baac);
          color: #05070a;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 24px 0 20px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 24px -6px rgba(36, 186, 172, 0.5);
        }

        .generate-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .generate-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .generate-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #a6f078, #2fd0c0);
          transform: translateY(-2px);
          box-shadow:
            0 18px 36px -10px rgba(36, 186, 172, 0.55),
            0 0 0 1px rgba(144, 235, 97, 0.3);
        }

        .generate-btn:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.4);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .canvas-container {
          text-align: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(144, 235, 97, 0.15);
          box-shadow: 0 10px 60px -10px rgba(36, 186, 172, 0.35);
          position: relative;
        }

        .canvas-controls {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .canvas-btn {
          padding: 8px 16px;
          border: 1.5px solid rgba(36, 186, 172, 0.5);
          border-radius: 8px;
          background: transparent;
          color: #5de0d4;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .canvas-btn:hover {
          background: linear-gradient(135deg, #90eb61, #24baac);
          border-color: transparent;
          color: #05070a;
        }

        canvas {
          display: block;
          margin: 0 auto;
          border-radius: 12px;
          background: #ffffff;
          box-shadow:
            0 15px 30px -8px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(144, 235, 97, 0.15);
          max-width: 100%;
          height: auto;
          transition: all 0.3s ease;
        }

        canvas:hover {
          transform: scale(1.02);
          box-shadow:
            0 20px 40px -10px rgba(36, 186, 172, 0.4),
            0 0 0 2px rgba(144, 235, 97, 0.25);
        }

        .download-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }

        .download-btn {
          padding: 14px;
          border: 1.5px solid rgba(36, 186, 172, 0.5);
          border-radius: 12px;
          background: transparent;
          color: #5de0d4;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .download-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #90eb61, #24baac);
          border-color: transparent;
          color: #05070a;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px -5px rgba(36, 186, 172, 0.5);
        }

        .download-btn:disabled {
          border-color: rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.35);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .download-btn.primary {
          background: linear-gradient(135deg, #90eb61, #24baac);
          border-color: transparent;
          color: #05070a;
        }

        .download-btn.primary:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.4);
        }

        footer {
          padding-bottom: 10px;
          text-align: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          z-index: 1;
        }

        /* Mobile specific styles */
        @media (max-width: 768px) {
          .main-container {
            padding: 15px;
            flex-direction: column;
            align-items: center;
          }
          .container {
            padding: 24px;
            border-radius: 20px;
          }

          .color-picker-container,
          .style-selector {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .style-preview {
            align-self: center;
            min-width: 45px;
            height: 45px;
          }

          .preview-grid {
            width: 20px;
            height: 20px;
          }

          .input-row {
            grid-template-columns: 1fr;
          }

          .download-section {
            grid-template-columns: 1fr;
          }

          .canvas-controls {
            flex-direction: column;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .qr-page * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Notification styles are global because notifications are appended to
          <body> (outside this component's DOM subtree), so styled-jsx scoping
          would not reach them. */}
      <style jsx global>{`
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 16px 24px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          z-index: 1000;
          transform: translateX(400px);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
          font-family: 'Inter', sans-serif;
        }

        .notification.success {
          background: linear-gradient(135deg, #10b981, #34d399);
        }

        .notification.error {
          background: linear-gradient(135deg, #ef4444, #f87171);
        }

        .notification.show {
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
}
