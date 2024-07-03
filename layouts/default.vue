<template>
  <div class="flex gap-10" style="direction: rtl;">
    <!-- الشريط الجانبي -->
    <aside :class="['sidebar', { 'sidebar-closed': !isSidebarOpen }]" >
      <!-- زر فتح/غلق الشريط الجانبي -->
      <button class="toggle-btn" @click="toggleSidebar">
        {{ isSidebarOpen ?  '⮞' : '⮜'}}
      </button>
      <!-- الشعار -->
      <div class="logo" v-if="isSidebarOpen">
        <img class="w-[150px] h-[150px] mx-auto" src="/assets/images/logo.png" alt="Logo">
      </div>
      <!-- الروابط الرأسية -->
      <nav class="nav-links" v-if="isSidebarOpen">
        <ul>
          <li class="bg-blue-500 py-2 px-4 rounded-lg hover:bg-white delayed font-bold" @click="$router.push('/')">الصفحة الرئيسية</li>
          <li class="bg-blue-500 py-2 px-4 rounded-lg hover:bg-white delayed font-bold" @click="$router.push('/about')">حول</li>
          <li class="bg-blue-500 py-2 px-4 rounded-lg hover:bg-white delayed font-bold" @click="$router.push('/contact')">اتصل بنا</li>
        </ul>
      </nav>
    </aside>

    <!-- المحتوى الرئيسي -->
    <main :class="['main-content', { 'main-content-expanded': !isSidebarOpen }]">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// التحكم في حالة الشريط الجانبي (مفتوح/مغلق)
const isSidebarOpen = ref(true)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<style scoped>
.delayed{
  transition:  0.5s;
}
.flex {
  display: flex;
}

.gap-10 {
  gap: 10px;
}

.sidebar {
  width: 200px; /* يمكنك تعديل العرض حسب الحاجة */
  background-color: rgb(209, 189, 72); /* اللون الخلفي للشريط الجانبي */
  color: white; /* لون النص */
  padding: 20px; /* الحواشي الداخلية */
  height: 100vh; /* أخذ كامل ارتفاع الشاشة */
  position: fixed; /* تثبيت الشريط الجانبي */
  transition: width 0.3s; /* تأثير الانتقال عند تغيير العرض */
  right: 0; /* تثبيت الشريط الجانبي إلى اليمين */
}

.sidebar-closed {
  width: 50px; /* عرض الشريط الجانبي عند غلقه */
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 20px;
}

.logo {
  text-align: center;
  margin-bottom: 20px; /* مسافة تحت الشعار */
}

.logo img {
  max-width: 100%; /* جعل الشعار يتناسب مع العرض المتاح */
}

.nav-links ul {
  list-style: none; /* إزالة التنقيط من القائمة */
  padding: 0; /* إزالة الحواشي الداخلية */
}

.nav-links li {
  margin: 20px 0; /* مسافة بين الروابط */
  cursor: pointer; /* تغيير شكل المؤشر عند التمرير فوق الرابط */
}

.nav-links li:hover {
  color: black; /* تغيير لون الرابط عند التمرير فوقه */
}

.main-content {
  margin-right: 220px; /* ترك مسافة كافية للمحتوى بجانب الشريط الجانبي */
  padding: 20px; /* حواشي داخلية للمحتوى */
  flex: 1; /* تجعل المحتوى الرئيسي يحتل المساحة المتبقية */
  transition: margin-right 0.3s; /* تأثير الانتقال عند تغيير المسافة */
}

.main-content-expanded {
  margin-right: 70px; /* ترك مسافة أقل عند غلق الشريط الجانبي */
}
</style>
