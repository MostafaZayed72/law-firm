<!-- components/DropdownMenu.vue -->
<template>
    <div class="relative" style="direction: rtl;">
      <span class="bg-blue-400 px-2 py-1 rounded-lg text-slate-50 hover:bg-blue-500 hover:text-black  delay cursor-pointer">أنواع القضايا</span>
      <div class="dropdown-menu delay">
        <NuxtLink class="dropdown-item" to="/active-cases"> النشطة</NuxtLink>
        <NuxtLink class="dropdown-item" to="/important-cases"> الهامة</NuxtLink>
        <NuxtLink class="dropdown-item" to="/ended-cases"> المنتهية</NuxtLink>
        <NuxtLink class="dropdown-item" to="/executions"> التنفيذات</NuxtLink>
        <NuxtLink class="dropdown-item" to="/experts"> الخبراء</NuxtLink>
      </div>
    </div>
  </template>
  
  <style scoped>
  .relative {
    position: relative;
  }
  
  .dropdown-toggle {
    display: block;
    padding: 0.5rem 1rem;
    background-color: #3490dc;
    color: white;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: rgb(255, 255, 255);
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: none;
  }
  
  .dropdown-menu .dropdown-item {
    display: block;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #333;
  }
  
  .dropdown-menu .dropdown-item:hover {
    @apply bg-blue-400;
  }
  
  /* Show dropdown on hover */
  .relative:hover .dropdown-menu {
    display: block;
  }
  </style>
  