let resizeTimeout; // Stores the timeout ID

window.addEventListener('resize', function () {
  // Clear the previous timeout if resizing is still happening
  clearTimeout(resizeTimeout);
  
  // Set a new timeout to apply layout changes only when resizing stops
  resizeTimeout = setTimeout(function () {
    // Directly check the window width inside the debounce function
    if (window.innerWidth <= 768) {
      // Switch to mobile layout
      document.body.classList.add('mobile');
      document.body.classList.remove('desktop');
    } else {
      // Switch to desktop layout
      document.body.classList.add('desktop');
      document.body.classList.remove('mobile');
    }
  }, 150); // Wait for 150ms after resizing stops
});
