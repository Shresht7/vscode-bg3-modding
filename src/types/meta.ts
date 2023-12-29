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
    | 'LSWString'
    | 'FixedString'
    | 'uint8'
    | 'int64'
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

type NodeDependencies = {
    id: 'Dependencies'
};

type NodeModuleInfo = {
    id: 'ModuleInfo',
    attribute: ModuleInfoAttribute[],
    children: {
        node: ModuleInfoChildren[],
    },
};

type ModuleInfoAttribute =
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

type ModuleInfoChildren =
    | NodePublishVersion
    | NodeScripts
    | NodeTargetModes
    ;

type NodePublishVersion = {
    id: 'PublishVersion',
    attribute: {
        id: 'Version64',
        type: 'int64',
        value: string
    }
};

type NodeScripts = {
    id: 'Scripts'
};

type NodeTargetModes = {
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
