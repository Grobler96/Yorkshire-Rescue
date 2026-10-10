(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Contact form: compose a tidy mailto: message from the fields.
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var body = [
        'Name: ' + f.name.value,
        'Phone: ' + f.phone.value,
        'Service: ' + f.service.value,
        'Location: ' + f.location.value,
        '',
        f.message.value
      ].join('\n');
      window.location.href = 'mailto:info@yorkshirerecovery.co.uk' +
        '?subject=' + encodeURIComponent('Website enquiry: ' + f.service.value) +
        '&body=' + encodeURIComponent(body);
    });
  }
})();
