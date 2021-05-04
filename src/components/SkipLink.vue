<template>
    <a class="skip-navigation screen-reader-text" :href="href">
        <slot>Skip carousel controls, go to main content</slot>
    </a>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SkipLink extends Vue {
    @Prop({ default: "" })
    readonly href!: string;
}
</script>