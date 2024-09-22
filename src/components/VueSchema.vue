<template>
    <div v-for="layer in layers" :key="layer.order" class="layer">
        <div v-for="block in layer.blocks" :key="block.id">
            <SchemaBlock :block="block" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SchemaBlock from '@/components/SchemaBlock.vue';
import type { SchemaBuilderBlock, SchemaBlockData, SchemaBuilderParams, SchemaBuilderLayer, SchemaBuilderBlockSizing } from '@/types/blocks';

const data = [
    {
        id: '1',
    },
    {
        id: '2',
        parent: '1',
    },
    {
        id: '3',
        parent: '1',
    },
    {
        id: '4',
        parent: '1',
    },
    {
        id: '5',
        parent: '2',
    },
    {
        id: '6',
        parent: '2',
    },
    {
        id: '7',
        parent: '3',
    },
    {
        id: '8',
        parent: '3',
    },
    {
        id: '9',
        parent: '4',
    },
    {
        id: '10',
        parent: '4',
    },
    {
        id: '11',
        parent: '4',
    },
];

const params = {
    spacing: 20,
    defaultWidth: 60,
};

const buildSchema = (params: SchemaBuilderParams, data: SchemaBlockData[]): SchemaBuilderBlock[] => {
    const rootBlocks = data.filter((block) => !block.parent);

    const build = (blocks: SchemaBlockData[]): SchemaBuilderBlock[] => {
        const parsedBlocks = blocks.map((block) => {
            const children = data.filter((b) => b.parent === block.id);
            const siblings = data
                .filter((v) => block.parent && v.parent === block.parent && v.id !== block.id, 0)
                .map((v) => ({ id: v.id, width: v.width || params.defaultWidth }));

            const childen = build(children);

            return {
                id: block.id,
                parent: block.parent,
                width: block.width || params.defaultWidth,
                ...(children.length ? { children: childen } : {}),
                ...(siblings.length ? { siblings } : {}),
            };
        });

        return parsedBlocks;
    };

    return build(rootBlocks)
}

const buildSizing = (params: SchemaBuilderParams, data: SchemaBuilderBlock[]): SchemaBuilderBlockSizing[] => {
    
    const buildSizing = (blocks: SchemaBuilderBlock[]): SchemaBuilderBlockSizing[] => {
        const parsedBlocks = blocks.map((block) : SchemaBuilderBlockSizing => {
            if (!block.children) {
                return {
                    ...block,
                    fullWidth: block.width
                } as SchemaBuilderBlockSizing
            } else {
                const children = buildSizing(block.children);
                const childrenWidth = children.reduce((acc, child) => acc + child.fullWidth, 0);

                const fullWidth = childrenWidth > block.width ? childrenWidth : block.width;

                return {
                    ...block,
                    fullWidth,
                    children,
                }
            }
        });

        return parsedBlocks
    };

    return buildSizing(data) || [];
};

const schema = ref<SchemaBuilderBlock[]>(buildSchema(params, data));

const schemaSizing = ref<SchemaBuilderBlockSizing[]>(buildSizing(params, schema.value));


const buildLayers = (data: SchemaBuilderBlockSizing[]): SchemaBuilderLayer[] => {
    const levels: SchemaBuilderLayer[] = [];

    function traverse(blocks: SchemaBuilderBlockSizing[], level: number) {
        if (!levels[level]) {
            levels[level] = { order: level + 1, blocks: [] };
        }

        levels[level].blocks.push(...blocks);

        blocks.forEach((block) => {
            if (block.children) {
                traverse(block.children, level + 1);
            }
        });
    }

    traverse(data, 0);

    const layers = levels.map((level, levelIndex) => {
        level.blocks = level.blocks.map((block, blockIndex) => {
            let left = level.blocks.reduce((acc, element, elementIndex) => {
                if (element.parent !== block.parent) {
                    const blockParentIndex = levels[levelIndex - 1].blocks.findIndex((v) => v.id === block.parent);
                    const elementParentIndex = levels[levelIndex - 1].blocks.findIndex((v) => v.id === element.parent);

                    if (blockParentIndex > elementParentIndex) return acc + element.fullWidth
                    return acc
                }
                else if ((element.parent === block.parent) && (blockIndex > elementIndex)) return acc + element.fullWidth;
                else return acc
            }, 0);

            // const branchElements = level.blocks.filter((v) => block.parent && v.parent === block.parent);
            // const branchElementIndex = branchElements.findIndex((v) => v.id === block.id);
            // const branchElementsWidth = branchElements.reduce((acc, v) => acc + v.width, 0);

            left += block.width > block.fullWidth ? 0 : (block.fullWidth - block.width) / 2;

            return {
                ...block,
                left,
            };
        });

        return level
    });

    return layers;
};

const layers = ref<SchemaBuilderLayer[]>(buildLayers(schemaSizing.value));

</script>

<style scoped>
.layer {
    position: relative;
    height: 30px;
}
</style>
