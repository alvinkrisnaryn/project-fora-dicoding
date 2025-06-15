import {
  urlBase64ToUint8Array,
  sendSubscriptionToServer,
  unsubscribeFromServer,
} from "../../utils/utils.js";

const Navbar = {
  async render() {
    return `
      <nav class="navbar" role="navigation" aria-label="Navigasi Utama">
        <ul class="navbar-list">
          <li><a href="#/home">Home</a></li>
          <li><a href="#/add">Add</a></li>
          <li><a href="#/favorites">Favorit</a></li>
          <li><a href="#/about">About</a></li>
        </ul>
        <button id="notifToggle" style="cursor: pointer; margin-right: 8px;">Loading...</button>
        <button id="logoutButton" class="logout-button" style="width: 44px; height: 44px; cursor: pointer; background-color: red">Logout</button>
      </nav>
    `;
  },

  async afterRender() {
    const toggleBtn = document.getElementById("notifToggle");
    const logoutButton = document.getElementById("logoutButton");

    toggleBtn.textContent = "SUBSCRIBE";

    toggleBtn.addEventListener("click", async () => {
      const reg = await navigator.serviceWorker.ready;
      const currentSub = await reg.pushManager.getSubscription();

      if (!currentSub) {
        if (Notification.permission !== "granted") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            console.warn("Izin notifikasi ditolak.");
            return;
          }
        }

        const newSub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
          ),
        });

        const notif = new Notification("Berhasil Berlangganan", {
          body: "Kamu akan menerima notifikasi terbaru!",
          icon: "/images/icon.png",
          badge: "/images/icon.png",
        });

        setTimeout(() => {
          notif.close();
        }, 5000);

        toggleBtn.textContent = "UNSUBSCRIBE";
        await sendSubscriptionToServer(newSub);
      } else {
        await currentSub.unsubscribe();
        await unsubscribeFromServer(currentSub);

        const notif = new Notification("Berhenti Berlangganan", {
          body: "Kamu tidak akan menerima notifikasi lagi.",
          icon: "/images/icon.png",
          badge: "/images/icon.png",
        });

        setTimeout(() => {
          notif.close();
        }, 5000);

        toggleBtn.textContent = "SUBSCRIBE";
      }
    });

    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "#/login";
    });
  },
};

export default Navbar;
