<template>
  <div class="page">
    <NeedleDisplay ref="needleDisplay" :value="needleModel" :points="needle.points" substr="bps" />
    <div class="page__controls">
      <div v-if="measuringInProgress"></div>
      <button v-else @click="measure">Measure</button>
      <div v-if="needleModelName !== null" class="page__control-results">
        <div>Ping: <b>{{this.avgPing}} ms</b></div>
        <div>Download: <b>{{(this.avgDownloadSpeedBytes * 8).toHumanString(3, 2, 1024)}}bps</b></div>
        <div>Upload: <b>{{(this.avgUploadSpeedBytes * 8).toHumanString(3, 2, 1024)}}bps</b></div>
      </div>
    </div>
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
          points: [0, 56*k, 256*k, 1*m, 5*m, 10*m, 25*m, 50*m, 100*m, 1*g]
        },
        measuringInProgress: false,
        needleModelName: null
      };
    },
    computed: {
      needleModel() {
        return (this[this.needleModelName] || 0) * 8;
      }
    },
    methods: {
      measure() {
        this.measuringInProgress = true;
  //this.needleModelName = "avgUploadSpeedBytes";
        this.checkPing().then(() => {
          this.needleModelName = "avgDownloadSpeedBytes";
          this.$refs.needleDisplay.reset();
          this.checkDownload().then(() => {
            this.needleModelName = "avgUploadSpeedBytes";
            this.$refs.needleDisplay.reset();
            this.checkUpload().then(() => {
              this.needleModelName = "";
              this.$refs.needleDisplay.reset();
              this.measuringInProgress = false;
            });
          });
        });
      }
    }
  }
</script>
