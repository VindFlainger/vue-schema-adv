<template>
    <div 
        class="schema-block"
        :style="{ 
            width: `${block.width}px`,
            left: `${block.left}px`
        }"
    >
        <div class="schema-block-inner">
            {{ block.id }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SchemaBuilderBlockSizing } from '@/types/blocks';

export interface Props {
    block: SchemaBuilderBlockSizing;
}

const props = withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="scss">
.schema-block {    
    position: absolute;
    padding: 4px;
    
}

.schema-block-inner {
    text-align: center;
    border: 1px black solid;
    width: 100%;
    height: 100%;
}
</style>
