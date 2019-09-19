export default {
  name: 'hpcFileUpload',
  props: {
    name: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    accept: {
      type: String,
      default: null,
    },
  },
  methods: {
    update() {
      const file = this.$refs.input.$el.querySelector('input').files[0];
      if (file) {
        this.$emit('updateAttachement', {
          name: this.name,
          file,
        });
      }
    },
  },
};
