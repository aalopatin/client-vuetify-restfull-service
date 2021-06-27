<template>
    <v-form>
        <v-text-field
          v-model="form.username"
          label="Login"
        ></v-text-field>
        <v-text-field
          v-model="form.password"
          label="Password"
        ></v-text-field>
      <v-btn
        class="mr-4"
        @click="onSubmit"
      >
        Submit
      </v-btn>
    </v-form>
</template>

<script>
export default {
  layout: 'empty-form',
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit(event) {
      this.$auth.loginWith('local', {
        data: {
          username: this.form.username,
          password: this.form.password
        }
      })
    }
  }
}
</script>
