<template>
    <div class="post-carousel">Stuff is here</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({ components: {} })
export default class App extends Vue {
    mounted() {
        console.log("HEre");
    }
}
</script>
