// generate a popup with the given message
const popup = (id, msg) => {
  window.onload = () => {
    if (sessionStorage.getItem(id) === 'true') {
      return;
    }
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
      <div>
        <div>${msg}</div>
        <div class=buttons>
        <button class=idButton>Don't show again</button>
        <button>Close</button>
        </div>
      </div>
    `;
    popup.querySelector('.idButton').addEventListener('click', () => {
      sessionStorage.setItem(id, 'true');
    });
    popup.querySelectorAll('button').forEach(button =>
      button.addEventListener('click', () => {
        let opacity = 1;
        setInterval(function () {
          opacity -= 10 / 200;
          if (opacity <= 0) {
            popup.remove();
          }
          popup.style.opacity = opacity;
          popup.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
        }, 10);
      })
    );
    document.body.appendChild(popup);
  };
};
