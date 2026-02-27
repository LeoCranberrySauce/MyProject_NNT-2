import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './QRCode.css';

const QRCode = () => {
  // Get the current website URL
  const websiteUrl = window.location.origin;

  return (
    <div className="qr-code" id='qr-code'>
      <div className='qr-code-header'>
        <h2> 𖣯 Scan QR Code</h2>
        <p className='qr-code-subtitle'> Scan this QR code with your mobile device to visit our website and learn more about our services.</p>
      </div>
      <div className="qr-code-container">
        <QRCodeSVG
          value={websiteUrl}
          size={128}
          level='M'
        />
      </div>
    </div>
  );
};

export default QRCode; 