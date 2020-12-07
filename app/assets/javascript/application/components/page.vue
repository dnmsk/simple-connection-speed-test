<template>
  <div>
    bla-bla
    <NeedleDisplay :value="needle.value" :points="needle.points" substr="bps" />
    <input type="number" name="needleValue" v-model="needle.value">
  </div>
</template>

<script>
  import NeedleDisplay from "./page/needle_display.vue";
  const k = 1024, m = 1024**2;

  export default {
    name: "Page",
    components: { NeedleDisplay },
    data() {
      return {
        needle: {
          points: [0, 56*k, 256*k, 1*m, 5*m, 10*m, 25*m, 50*m, 100*m, 1024*m],
          value: (1.45345 * 5*m)
        }
      };
    }
  }
</script>
