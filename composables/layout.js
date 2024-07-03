import { ref } from 'vue'

const drawer = ref(true)
const isPermanent = ref(false)
const drawerWidth = ref(300)

export function useLayout() {
  function toggleDrawer() {
    isPermanent.value = !isPermanent.value
    drawerWidth.value = isPermanent.value ? 300 : 80
  }

  return {
    drawer,
    isPermanent,
    drawerWidth,
    toggleDrawer,
  }
}
