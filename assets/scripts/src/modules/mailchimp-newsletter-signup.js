export default function mailchimpNewsletterSignup(event) {
  // Mailchimp’s embed script loads the full jQuery library just for basic form validation!
  // Let’s do this in pure JavaScript :)

  event.preventDefault();

  this.form = this.querySelector('form');
  this.action = this.form.getAttribute('action');
  this.email = this.form.querySelector('input.email').value;
  this.name = this.form.querySelector('input.name').value;

  document.MC_callback = (response) => {
    const signupForm = document.getElementById('mc-embedded-subscribe-form');

    if (response.result === 'success') {
      // Show success message
      const successMessage = document.createElement('p');
      successMessage.textContent = 'Success! Thanks for signing up. We’ll keep you updated with the latest news about Projekt w tropikach.';
      signupForm.appendChild(successMessage);
    } else {
      // Show error message
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Oops! An error occurred. Check your email address and try again.';
      signupForm.appendChild(errorMessage);
    }
  };

  // Generate script
  this.script = document.createElement('script');
  this.script.type = 'text/javascript';
  this.script.src = `${this.action}&c=document.MC_callback&EMAIL=${this.email}&NAME=${this.name ? this.name : ''}`;

  // Append script to head
  document.getElementsByTagName('head')[0].appendChild(this.script);
}
