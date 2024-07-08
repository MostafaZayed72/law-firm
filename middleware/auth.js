// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
    // تأكد من أن هذا الكود يتم تنفيذه في المتصفح فقط
    if (process.client) {
      const logedIn = localStorage.getItem('logedIn') ;
      if (logedIn == 'false') {
        alert('يجب تسجيل الدخول أولاً')
        return navigateTo('/login');
      }
    }
  });
  