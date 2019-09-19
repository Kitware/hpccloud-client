function formatTime(time) {
  const date = new Date(time * 1000);
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();
  let seconds = date.getSeconds().toString();
  let ms = date.getMilliseconds().toString();

  hours = hours.length === 1 ? `0${hours}` : hours;
  minutes = minutes.length === 1 ? `0${minutes}` : minutes;
  seconds = seconds.length === 1 ? `0${seconds}` : seconds;
  while (ms.length < 3) {
    ms = `0${ms}`;
  }

  return `${hours}:${minutes}:${seconds}.${ms}`;
}

export default {
  name: 'hpcLogEntry',
  props: {
    log: {
      type: Array,
      default() {
        return [];
      },
    },
    maxHeight: {
      type: String,
      default: '200px',
    },
  },
  computed: {
    formattedLog() {
      return this.log
        .map((e) => this.logToTxt(e))
        .filter((v) => !!v)
        .join('\n');
    },
  },
  methods: {
    logToTxt(entry) {
      if (!entry) {
        return null;
      }
      let content = '';
      let foldContent = null;
      let msg = entry.msg;
      // const color = this.$style[entry.levelname] || '';
      if (msg !== null && typeof msg === 'object') {
        msg = JSON.stringify(msg, null, 2);
      }

      if (entry.status) {
        msg += ` [${entry.status}]`;
      }

      content += `[${formatTime(entry.created)}] ${entry.levelname}: ${msg}`;

      // Handle nested case...
      if (entry.exc_info) {
        foldContent = entry.exc_info[2].join('');
        foldContent += `${entry.exc_info[0]}: ${entry.exc_info[1]}`;
      }

      if (entry.data && Object.keys(entry.data).length > 0) {
        foldContent = `${JSON.stringify(entry.data, null, 2)}`;
      }

      if (foldContent !== null) {
        // console.error('Got log hierarchy...');
        // if (foldContent !== null) {
        //   return (
        //     <LogFold
        //       key={`${entry.created}_${index}`}
        //       header={content}
        //       content={foldContent}
        //       color={color}
        //     />
        //   );
        // }
        return [content, foldContent].join('\n');
      }

      return content;
    },
  },
};
