/**
 * Email Service
 * Modular email service for future SMTP integration (Nodemailer, SendGrid, etc.)
 * Currently logs to console.
 */

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // TODO: Implement actual SMTP sending here
    console.log('\n=========================================');
    console.log('📧 MOCK EMAIL SENT');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    console.log('=========================================\n');
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

const sendBookingConfirmation = async (booking) => {
  const subject = `Booking Request Received - ${booking.eventType || 'Photography Session'}`;
  const text = `
    Dear ${booking.name},
    
    Thank you for your inquiry. Your booking request has been received.
    We will review your details and contact you shortly regarding availability.
    
    Requested Date: ${booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'TBD'}
    Service: ${booking.eventType || 'Not specified'}
    
    Best regards,
    Sikhar Photography
  `;
  return sendEmail({ to: booking.email, subject, text });
};

const sendBookingStatusUpdate = async (booking) => {
  const subject = `Booking Update: ${booking.status.toUpperCase()}`;
  const text = `
    Dear ${booking.name},
    
    Your booking status has been updated to: ${booking.status.toUpperCase()}.
    
    ${booking.notes ? `Note from photographer: ${booking.notes}` : ''}
    
    Best regards,
    Sikhar Photography
  `;
  return sendEmail({ to: booking.email, subject, text });
};

const sendClientGalleryReady = async (gallery, clientEmail) => {
  const subject = `Your Gallery is Ready: ${gallery.title}`;
  const text = `
    Dear ${gallery.clientName},
    
    Your private client gallery is now ready to view!
    
    Gallery: ${gallery.title}
    Access Link: ${process.env.CLIENT_URL || 'http://localhost:5173'}/gallery/${gallery.slug}
    Password: ${gallery.password || 'None required'}
    
    ${gallery.expiryDate ? `Please note: This gallery will expire on ${new Date(gallery.expiryDate).toLocaleDateString()}.` : ''}
    
    Enjoy your photos!
    
    Best regards,
    Sikhar Photography
  `;
  return sendEmail({ to: clientEmail, subject, text });
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendBookingStatusUpdate,
  sendClientGalleryReady
};
