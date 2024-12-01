<template>
  <div>
    g
  </div>
</template>
<script setup lang="ts">
const {fetchData,getUrl} = useHelpers()
async function fetchTestApi(){
  let url = getUrl('products')
  const response = await fetchData({url})
  console.log(response)
}
onMounted(async ()=>{
  await fetchTestApi()
})
</script>