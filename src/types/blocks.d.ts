export interface SchemaBlockData {
    id: string;
    parent?: string;
    width?: number;
}

export interface SchemaBuilderBlockSibling {
    id: string;
    width: number;
}

export interface SchemaBuilderBlock extends SchemaBlockData {
    id: string;
    width: number;
    children?: SchemaBuilderBlock[];
    siblings?: SchemaBuilderBlockSibling[];
}

export interface SchemaBuilderBlockSizing extends SchemaBuilderBlock {
    fullWidth: number;
    children?: SchemaBuilderBlockSizing[];
}

export interface SchemaBuilderParams {
    spacing: number;
    defaultWidth: number;
}


export interface SchemaBuilderLayer {
    order: number,
    blocks: SchemaBuilderBlockSizing[]
}