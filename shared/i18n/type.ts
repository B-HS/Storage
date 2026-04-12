export type Locale = 'ko' | 'en' | 'jp'

export type TranslationKeys = {
    save: string
    cancel: string
    delete: string
    rename: string
    download: string
    upload: string
    preview: string
    email: string
    password: string
    name: string
    logout: string

    login: string
    loginSubtitle: string
    loginLoading: string
    register: string
    registerSubtitle: string
    registerLoading: string
    confirmPassword: string
    noAccount: string
    hasAccount: string
    namePlaceholder: string

    myPage: string
    myStorage: string

    heroTagline: string
    heroTitle1: string
    heroTitle2: string
    heroDescription: string
    heroCtaPrimary: string
    heroCtaSecondary: string

    featuresSectionTitle: string
    featuresSectionSubtitle: string
    featureUnlimitedTitle: string
    featureUnlimitedDesc: string
    featureSecurityTitle: string
    featureSecurityDesc: string
    featureSpeedTitle: string
    featureSpeedDesc: string
    featureFolderTitle: string
    featureFolderDesc: string
    featureSearchTitle: string
    featureSearchDesc: string
    featureMobileTitle: string
    featureMobileDesc: string

    ctaTitle: string
    ctaDescription: string
    ctaButton: string

    footerCopyright: string

    authLayoutDescription: string

    home: string
    emptyFolder: string
    dropFiles: string
    zoomIn: string
    zoomOut: string
    deselect: string
    selectedCount: (count: number) => string
    exportZip: string
    deleteFile: string
    deleteConfirmTitle: string
    deleteConfirmDescription: (name: string) => string
    renameTitle: string
    newName: string
    newFolder: string
    newFolderTitle: string
    folderName: string

    detailTitle: string
    detailType: string
    detailFolder: string
    detailFileType: (ext: string) => string
    detailSize: string
    detailCreated: string
    detailModified: string

    columnName: string
    columnSize: string
    columnModified: string

    profileEdit: string
    profileEditDesc: string

    folderCreated: string
    renameSuccess: string
    deleteSuccess: string
    uploadSuccess: string

    errorFileTooLarge: string
    errorQuotaExceeded: string
    errorDuplicateFile: string
    errorFolderNameDuplicate: string
    errorCircularRef: string
    errorAssetNotFound: string
    errorFolderNotFound: string
    errorInvalidMimeType: string
    errorUnknown: string
    errorFileEmpty: string
    errorBlockedExtension: string
    errorNetwork: string
    errorUnauthorized: string
    errorAllTiersFailed: string
    errorUploadEventFailed: string

    errorLoginFailed: string
    errorRegisterFailed: string

    togglePublic: string
    publicFile: string
    privateFile: string

    sortByName: string
    sortByDate: string
    sortBySize: string
    ascending: string
    descending: string

    filterAll: string
    filterImages: string
    filterDocuments: string
    filterVideo: string
    filterAudio: string

    previousPage: string
    nextPage: string

    moveSuccess: string
}
