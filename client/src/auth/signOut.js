// Centralized sign-out: clear app auth state and redirect to /login.
export async function signOutWithRedirect(clear) {
  try {
    clear();                         // clear context + localStorage
    window.location.replace("/login");
  } catch (e) {
    console.error("Sign-out failed:", e);
    alert("Sign-out failed, please try again.");
  }
}
