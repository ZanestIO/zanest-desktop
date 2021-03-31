module.exports = {
    inject: ['seen', 'title', 'body', 'type', 'contactAdmin'],
    emits: ['close-notification'],
    template: `
      <teleport to="#wrapper">
      <div class="notification" :class="[type.value]" v-if="seen.value">
        <div class="not-close" @click="$emit('close-notification')"><i class="fa fa-times text-lg"></i></div>
        <div class="not-header">{{ title.value }}</div>
        <div class="not-body">{{ body.value }}</div>
        <div class="not-footer" v-if="contactAdmin.value">لطفا پیغام خطای بالا را به پشتیبانی بفرستید.</div>
      </div>
      </teleport>
    `,
    methods: {
    }
}
