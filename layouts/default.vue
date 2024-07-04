<template>
  <div style="direction: rtl;" class="dark:bg-dark1 bg-gray-300 dark:text-white">
    <v-layout>
      <v-navigation-drawer
     
        location="right"
        permanent
        
        
      >
        <template v-slot:prepend>
          <div class="flex flex-col">
            <div class="flex justify-center items-center gap-10">
              <img class="w-[20%] " src="/assets/images/logo.png" alt="">
              <color-mode /> <!-- استدعاء مكون اللون هنا -->
            </div>
            <v-list-item
              lines="two"
              prepend-avatar="https://media-hbe1-1.cdn.whatsapp.net/v/t61.24694-24/445156387_434453806052029_8839455247940985259_n.jpg?ccb=11-4&oh=01_Q5AaIG_mOtKGSomW6-qC0lK8ZpXSPLKmeBMkPTJkCYLhss9c&oe=6691058A&_nc_sid=e6ed6c&_nc_cat=107"
              subtitle="Logged in"
              title="أ/عبدالله"
            ></v-list-item>
          </div>
        </template>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-city" title="الرئيسية" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="حسابي" value="account"></v-list-item>
          <v-list-item prepend-icon="mdi-gavel" title="جميع القضايا" value="users"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      

      <v-main class="h-screen mr-4">
        <slot /> <!-- هنا يجب أن يكون الـ slot داخل الـ v-main -->
      </v-main>
    </v-layout>
  </div>
</template>

