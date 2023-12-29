// -------------------------
// META.LSX TYPE DEFINITIONS
// -------------------------

export type Meta = {
    save: {
        version: Version,
        region: {
            id: "Config",
            node: NodeRoot
        }
    }
};

export type Version = {
    major: number,
    minor: number,
    revision: number,
    build: number
};

type Node<T extends string = string> = {
    id: T,
    attribute?: NodeAttribute | NodeAttribute[]
    children?: {
        node: Node | Node[]
    }
};

type NodeAttributeType =
    | { type: 'LSString', value: string }
    | { type: 'LSWString', value: string }
    | { type: 'FixedString', value: string }
    | { type: 'uint8', value: string }
    | { type: 'int64', value: string }
    ;

type NodeAttribute = {
    id: string,
    type: NodeAttributeType,
    value: string
} & {
    type: 'uint8',
    value: number
};

type NodeRoot = {
    id: 'root',
    children: {
        node: [
            NodeDependencies,
            NodeModuleInfo,
        ]
    }
};

// #region DEPENDENCIES

export type NodeDependencies = {
    id: 'Dependencies',
    children?: {
        node: NodeDependency[]
    }
};

export type NodeDependency = {
    id: "ModuleShortDesc",
    attribute: NodeDependencyAttribute[]
};

export type NodeDependencyAttribute =
    | { id: 'Folder', type: 'LSString', value: string }
    | { id: 'MD5', type: 'LSString', value: string }
    | { id: 'Name', type: 'LSString', value: string }
    | { id: 'UUID', type: 'FixedString', value: string }
    | { id: 'Version64', type: 'int64', value: string }
    ;

// #endregion

// #region MODULE INFO

export type NodeModuleInfo = {
    id: 'ModuleInfo',
    attribute: ModuleInfoAttribute[],
    children: {
        node: ModuleInfoChildren[],
    },
};

export type ModuleInfoAttribute =
    | { id: 'Author', type: 'LSWString', value: string }
    | { id: 'CharacterCreationLevelName', type: 'FixedString', value: string }
    | { id: 'Description', type: 'LSWString', value: string }
    | { id: 'Folder', type: 'LSWString', value: string }
    | { id: 'GMTemplate', type: 'FixedString', value: string }
    | { id: 'LobbyLevelName', type: 'FixedString', value: string }
    | { id: 'MD5', type: 'LSString', value: string }
    | { id: 'MainMenuBackgroundVideo', type: 'FixedString', value: string }
    | { id: 'MenuLevelName', type: 'FixedString', value: string }
    | { id: 'Name', type: 'FixedString', value: string }
    | { id: 'NumPlayers', type: 'uint8', value: number }
    | { id: 'PhotoBooth', type: 'FixedString', value: string }
    | { id: 'StartupLevelName', type: 'FixedString', value: string }
    | { id: 'Tags', type: 'LSWString', value: string }
    | { id: 'Type', type: 'FixedString', value: 'Adventure' | 'Add-on' }
    | { id: 'UUID', type: 'FixedString', value: string }
    | { id: 'Version64', type: 'int64', value: string }
    ;

// #endregion MODULE INFO

// #region MODULE INFO - CHILDREN

type ModuleInfoChildren =
    | ModuleInfoPublishVersion
    | ModuleInfoScripts
    | ModuleInfoTargetModes
    ;

type ModuleInfoPublishVersion = {
    id: 'PublishVersion',
    attribute: {
        id: 'Version64',
        type: 'int64',
        value: string
    }
};

type ModuleInfoScripts = {
    id: 'Scripts'
};

type ModuleInfoTargetModes = {
    id: 'TargetModes',
    children: {
        node: {
            id: 'Target',
            attribute: {
                id: 'Object',
                type: 'FixedString',
                value: 'Story'
            }
        }
    }
};

//#endregion
