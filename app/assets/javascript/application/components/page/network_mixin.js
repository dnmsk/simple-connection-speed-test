function cleanArray(arr) {
  while(arr.pop()) {}
}

const parallelQueries = [
  { ping: 5, cnt: 3, timeout: 10000 },
  { ping: 50, cnt: 3, timeout: 10000 },
  { ping: 100, cnt: 2, timeout: 10000 },
  { ping: 1000, cnt: 2, timeout: 10000 },
  { ping: 10000000, cnt: 1, timeout: 10000 },
];

export default {
  data() {
    return {
      networkStat: {
        pingResults: [],
        downloadResults: [],
        uploadResults: []
      }
    }
  },
  computed: {
    avgPing() {
      return this.networkStat.pingResults
        .reduce((a, b) => a + b, 0)/this.networkStat.pingResults.length;
    },
    avgDownloadSpeedBytes() {
      return this.networkStat.downloadResults
        .reduce((a, b) => a + b.length/(Math.max(b.changedAt - b.startedAt, 1)/1000), 0);
    },
    avgUploadSpeedBytes() {
      return this.networkStat.uploadResults
        .reduce((a, b) => a + b.length/(Math.max(b.changedAt - b.startedAt, 1)/1000), 0);
    },
  },
  methods: {
    checkPing(cnt = 5) {
      cleanArray(this.networkStat.pingResults);

      return new Promise(success => {
        let startPing = () => {
          let startedAt = new Date();
          this.$ajax.head('/ping.txt')
            .then(response => {
              this.networkStat.pingResults.push(new Date() - startedAt);
              if (--cnt > 0) {
                startPing();
              } else {
                success();
              }
            })
            .catch(e => startPing());
        }
        startPing();
      });
    },
    checkDownload(params = {}) {
      cleanArray(this.networkStat.downloadResults);
      let avgPing = this.avgPing;
      let parallelParams = {
        ...(parallelQueries.find(el => el.ping < avgPing) || {}),
        ...params
      };
      let canUpdateStat = true;
      let downloadFn = () => {
        let d = new Date();
        let downloadStat = { startedAt: d, changedAt: d, length: 0};
        this.networkStat.downloadResults.push(downloadStat);

        return this.$ajax.get('/stream', {l: 25*1024*1024}, {
          onDownloadProgress(progressEvent) {
            if (canUpdateStat) {
              downloadStat.changedAt = new Date();
              downloadStat.length = progressEvent.loaded;
            }
          }
        }).then(response => {
          if (canUpdateStat) {
            downloadStat.length = response.data.length;
            canUpdateStat = false;
          }
        });
      }
      return new Promise(success => {
        let cnt = parallelParams && parallelParams.cnt || 1;
        for (let i = cnt; i >0; i--) {
          downloadFn().then(() => {
            if (--cnt == 0) {
              success();
            }
          });
        }
        setTimeout(() => {
          if (cnt > 0) {
            canUpdateStat = false;
            cnt = -1;
            success();
          }
        }, parallelParams.timeout);
      });
    },
    checkUpload(params = {}) {
      cleanArray(this.networkStat.uploadResults);
      let avgPing = this.avgPing;
      let parallelParams = {
        uploadBytes: this.avgDownloadSpeedBytes,
        ...(parallelQueries.find(el => el.ping < avgPing) || {}),
        ...params
      };
      const uploadData = new FormData();
      uploadData.append('arrayBytes[]', [...Array(parseInt(parallelParams.uploadBytes)).keys()]);

      let canUpdateStat = true;
      let uploadFn = () => {
        let d = new Date();
        let uploadStat = { startedAt: d, changedAt: d, length: 0};
        this.networkStat.uploadResults.push(uploadStat);

        return this.$ajax.post('/stream', uploadData, {
          onUploadProgress(progressEvent) {
            if (canUpdateStat) {
              uploadStat.changedAt = new Date();
              uploadStat.length = progressEvent.loaded;
            }
          }
        }).then(response => {
          if (canUpdateStat) {
            canUpdateStat = false;
          }
        });
      }
      return new Promise(success => {
        let cnt = 1;
        //let cnt = Math.max(parseInt(parallelParams && parallelParams.cnt || 1)/2, 1);
        for (let i = cnt; i > 0; i--) {
          uploadFn().then(() => {
            if (--cnt == 0) {
              success();
            }
          });
        }
        setTimeout(() => {
          if (cnt > 0) {
            canUpdateStat = false;
            cnt = -1;
            success();
          }
        }, parallelParams.timeout);
      });
    }
  }
};
