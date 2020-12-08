<template>
  <div class="page">
    <NeedleDisplay :value="needle.value" :points="needle.points" substr="bps" />
    <input type="number" name="needleValue" v-model="needle.value">
  </div>
</template>

<script>
  import NeedleDisplay from "./page/needle_display.vue";
  import NetworkMixin  from "./page/network_mixin";
  const k = 1024, m = 1024**2, g = 1024**3;

  export default {
    name: "Page",
    components: { NeedleDisplay },
    mixins: [NetworkMixin],
    data() {
      return {
        needle: {
          points: [0, 56*k, 256*k, 1*m, 5*m, 10*m, 25*m, 50*m, 100*m, 1*g],
          value: (1.45345 * 5*m)
        }
      };
    },
    methods: {

    }
  }
</script>
