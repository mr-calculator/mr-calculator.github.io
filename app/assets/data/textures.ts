export interface Texture {
    /**
     * The default sprite for this icon
     */
    default: string,
    hover?: string,
    active?: string
}

export const TEX = {
    logo: {
        default: '../icons/logo.png'
    } as Texture,
    logoLarge: {
        default: '../icons/logo-large.webp'
    } as Texture,

    scrollbar: {
        default: 'ui/scrollbar.png'
    } as Texture,
    squareButton: {
        default: 'ui/square-button.png',
        hover: 'ui/square-button-hover.png'
    } as Texture,
    infoButton: {
        default: 'ui/info-button.png',
        hover: 'ui/info-button-hover.png'
    } as Texture,
    button: {
        default: 'ui/button.png',
        hover: 'ui/button-hover.png'
    } as Texture,
    buttonWhite: {
        default: 'ui/button-white.png',
        hover: 'ui/button-white-hover.png'
    } as Texture,
    buttonDark: {
        default: 'ui/button-dark.png',
        hover: 'ui/button-dark-hover.png'
    } as Texture,
    buttonReadMore: {
        default: 'ui/read-more.png',
        hover: 'ui/read-more-hover.png'
    } as Texture,
    userCog: {
        default: 'ui/user-cog.png',
        hover: 'ui/user-cog-hover.png',
    } as Texture,
    favouriteCorner: {
        default: 'ui/favourite-corner.png',
    } as Texture,
    favouriteCornerLeft: {
        default: 'ui/favourite-corner-left.png',
    } as Texture,
    checkCorner: {
        default: 'ui/check-corner.png',
    } as Texture,
    checkbox: {
        default: 'ui/checkbox.png',
        hover: 'ui/checkbox-hover.png',
    } as Texture,
    checkboxCheck: {
        default: 'ui/checkbox-check.png'
    } as Texture,
    check: {
        default: 'ui/check.png'
    } as Texture,
    checkBlue: {
        default: 'ui/check-blue.png'
    } as Texture,
    cross: {
        default: 'ui/cross.png'
    } as Texture,
    crossBlue: {
        default: 'ui/cross-blue.png'
    } as Texture,
    panelTabSeparator: {
        default: 'ui/panel-tab-separator.png'
    } as Texture,
    panelTabLine: {
        default: 'ui/tab-line.png'
    } as Texture,
    separatorLinesLeft: {
        default: 'ui/separator-lines-left.svg'
    } as Texture,
    separatorLinesRight: {
        default: 'ui/separator-lines-right.svg'
    } as Texture,
    playerLevelBackground: {
        default: 'ui/player-level-background.png'
    } as Texture,

    cornerDecoLeftBottom: {
        default: 'ui/corner-deco-left-bottom.png',
    } as Texture,
    cornerDecoLeftTop: {
        default: 'ui/corner-deco-left-top.png',
    } as Texture,
    cornerDecoRightBottom: {
        default: 'ui/corner-deco-right-bottom.png',
    } as Texture,
    cornerDecoRightTop: {
        default: 'ui/corner-deco-right-top.png',
    } as Texture,

    borderTop: {
        default: 'ui/border-top.png',
    } as Texture,
    borderBottom: {
        default: 'ui/border-bottom.png',
    } as Texture,

    swapBg: {
        default: 'ui/swap-bg.png',
        hover: 'ui/swap-bg-hover.png'
    } as Texture,
    swapBgStretch: {
        default: 'ui/swap-bg-stretch.png',
        hover: 'ui/swap-bg-stretch-hover.png'
    } as Texture,
    swapBgDetails: {
        default: 'ui/swap-bg-details.png',
        hover: 'ui/swap-bg-details-hover.png'
    } as Texture,

    tab: {
        default: 'ui/tab.png',
        active: 'ui/tab-active.png'
    } as Texture,
    tabStraight: {
        default: 'ui/tab-straight.png',
        active: 'ui/tab-straight-active.png'
    } as Texture,
    tabSpecial: {
        default: 'ui/tab-special.png',
        hover: 'ui/tab-special-hover.png'
    } as Texture,
    tabActiveAnimated: {
        default: 'ui/tab-active-animated.gif'
    } as Texture,
    tabSpecialAnimated: {
        default: 'ui/tab-special-animated.gif'
    } as Texture,
    leftTriangle: {
        default: 'ui/left-triangle.webp'
    } as Texture,
    rightTriangle: {
        default: 'ui/right-triangle.webp'
    } as Texture,

    leftPanel: {
        default: 'ui/left-panel.webp'
    } as Texture,
    rightPanel: {
        default: 'ui/right-panel.webp'
    } as Texture,

    rankBg: {
        default: 'ui/ranks/rank-bg.png'
    } as Texture,
    rankAgent: {
        default: 'ui/ranks/agent.png'
    } as Texture,
    rankAgentBg: {
        default: 'ui/ranks/agent-bg.png'
    } as Texture,
    rankKnight: {
        default: 'ui/ranks/knight.png'
    } as Texture,
    rankKnightBg: {
        default: 'ui/ranks/knight-bg.png'
    } as Texture,
    rankCaptain: {
        default: 'ui/ranks/captain.png'
    } as Texture,
    rankCaptainBg: {
        default: 'ui/ranks/captain-bg.png'
    } as Texture,
    rankCenturion: {
        default: 'ui/ranks/centurion.png'
    } as Texture,
    rankCenturionBg: {
        default: 'ui/ranks/centurion-bg.png'
    } as Texture,
    rankLord: {
        default: 'ui/ranks/lord.png'
    } as Texture,
    rankLordBg: {
        default: 'ui/ranks/lord-bg.png'
    } as Texture,
    rankCount: {
        default: 'ui/ranks/count.png'
    } as Texture,
    rankCountBg: {
        default: 'ui/ranks/count-bg.png'
    } as Texture,
    rankColonel: {
        default: 'ui/ranks/colonel.png'
    } as Texture,
    rankColonelBg: {
        default: 'ui/ranks/colonel-bg.png'
    } as Texture,
    rankWarrior: {
        default: 'ui/ranks/warrior.png'
    } as Texture,
    rankWarriorBg: {
        default: 'ui/ranks/warrior-bg.png'
    } as Texture,
    rankElite: {
        default: 'ui/ranks/elite.png'
    } as Texture,
    rankEliteBg: {
        default: 'ui/ranks/elite-bg.png'
    } as Texture,
    rankGuardian: {
        default: 'ui/ranks/guardian.png'
    } as Texture,
    rankGuardianBg: {
        default: 'ui/ranks/guardian-bg.png'
    } as Texture,
    rankChampion: {
        default: 'ui/ranks/champion.png'
    } as Texture,
    rankChampionBg: {
        default: 'ui/ranks/champion-bg.png'
    } as Texture,

    lordBadgeGray: {
        default: 'ui/ranks/lord-badge-gray.png'
    } as Texture,
    championBadgeGray: {
        default: 'ui/ranks/champion-badge-gray.png'
    } as Texture,

    noRankDataBg: {
        default: 'ui/no-rank-data-bg.png'
    } as Texture,

    markBackground: {
        default: 'ui/mark-bg.png'
    } as Texture,

    drawTopLeftCorner: {
        default: 'ui/draw-top-left-corner.png'
    } as Texture,
    drawBottomRightCorner: {
        default: 'ui/draw-bottom-right-corner.png'
    } as Texture,
    drawBottomLeftCorner: {
        default: 'ui/draw-bottom-left-corner.png'
    } as Texture,

    cog: {
        default: 'icon/cog.png',
    } as Texture,
    chart: {
        default: 'icon/chart.png',
    } as Texture,
    calculator: {
        default: 'icon/calculator.png'
    } as Texture,
    swap: {
        default: 'icon/swap.png'
    } as Texture,
    chevronLeft: {
        default: 'icon/chevron-left.png'
    } as Texture,
    chevronRight: {
        default: 'icon/chevron-right.png'
    } as Texture,
    chevronDown: {
        default: 'icon/chevron-down.png'
    } as Texture,
    chevronUp: {
        default: 'icon/chevron-up.png'
    } as Texture,
    arrowLeft: {
        default: 'icon/arrow-left.png'
    } as Texture,
    arrowRight: {
        default: 'icon/arrow-right.png'
    } as Texture,
    arrowBox: {
        default: 'icon/arrow-box.png'
    } as Texture,
    close: {
        default: 'icon/close.png'
    } as Texture,
    edit: {
        default: 'icon/edit.png'
    } as Texture,
    more: {
        default: 'icon/more.png'
    } as Texture,
    photo: {
        default: 'icon/photo.png'
    } as Texture,
    time: {
        default: 'icon/time.png'
    } as Texture,
    timeArcade: {
        default: 'icon/time-arcade.png'
    } as Texture,
    gameTime: {
        default: 'icon/game-time.png'
    } as Texture,
    mouseScrollUp: {
        default: 'icon/mouse-scroll-up.png'
    } as Texture,
    mouse: {
        default: 'icon/mouse.png'
    } as Texture,
    mouseLeft: {
        default: 'icon/mouse-left.png'
    } as Texture,
    mouseRight: {
        default: 'icon/mouse-right.png'
    } as Texture,
    mouseScroll: {
        default: 'icon/mouse-scroll.png'
    } as Texture,
    mouseScrollClick: {
        default: 'icon/mouse-scroll-click.png'
    } as Texture,
    mouseScrollDown: {
        default: 'icon/mouse-scroll-down.png'
    } as Texture,
    mouseDrag: {
        default: 'icon/mouse-drag.png'
    } as Texture,
    tap: {
        default: 'icon/tap.webp'
    } as Texture,
    hamburger: {
        default: 'icon/hamburger.png'
    } as Texture,
    gift: {
        default: 'icon/gift.png',
    } as Texture,
    giftGold: {
        default: 'icon/gift-gold.png',
    } as Texture,
    achievementGift: {
        default: 'icon/achievement-gift.png',
    } as Texture,
    proficiency: {
        default: 'icon/proficiency.png',
        hover: 'icon/proficiency-hover.png',
    } as Texture,
    proficiencyGray: {
        default: 'icon/proficiency-gray.png',
    } as Texture,
    proficiencyIcon: {
        default: 'icon/proficiency-icon.webp',
    } as Texture,
    missionInfinity: {
        default: 'icon/mission-infinity.png',
    } as Texture,
    missionRepeat: {
        default: 'icon/mission-repeat.png',
    } as Texture,
    missionRepeat15: {
        default: 'icon/mission-repeat-15.png',
    } as Texture,
    dropdownCaret: {
        default: 'icon/dropdown-caret.png'
    } as Texture,
    dropdownCaretUp: {
        default: 'icon/dropdown-caret-up.png'
    } as Texture,
    dropdownCheck: {
        default: 'icon/check.png'
    } as Texture,
    checkRhombus: {
        default: 'icon/check-rhombus.png'
    } as Texture,
    favourite: {
        default: 'icon/favourite.png',
        hover: 'icon/favourite-hover.png'
    } as Texture,
    redDot: {
        default: 'icon/red-dot.png'
    } as Texture,
    redDotExcl: {
        default: 'icon/red-dot-excl.png'
    } as Texture,
    minus: {
        default: 'icon/minus.png',
    } as Texture,
    plus: {
        default: 'icon/plus.png',
    } as Texture,
    none: {
        default: 'icon/none.png',
    } as Texture,
    search: {
        default: 'icon/search.png',
    } as Texture,
    target: {
        default: 'icon/target.png',
    } as Texture,
    reset: {
        default: 'icon/reset.png'
    } as Texture,
    competitiveIcon: {
        default: 'icon/competitive.png'
    } as Texture,
    quickMatchIcon: {
        default: 'icon/quick-match.png'
    } as Texture,
    arcadeIcon: {
        default: 'icon/arcade.png'
    } as Texture,
    chain: {
        default: 'icon/chain.png'
    } as Texture,
    chainBroken: {
        default: 'icon/chain-broken.png'
    } as Texture,
    link: {
        default: 'icon/link.png'
    } as Texture,
    share: {
        default: 'icon/share.png'
    } as Texture,
    unknownHero: {
        default: 'icon/unknown-hero.png'
    } as Texture,
    warning: {
        default: 'icon/warning.png'
    } as Texture,
    delete: {
        default: 'icon/delete.png'
    } as Texture,
    star: {
        default: 'icon/star.png'
    } as Texture,
    levelUp: {
        default: 'icon/level-up.png'
    } as Texture,
    copy: {
        default: 'icon/copy.png'
    } as Texture,
    allHeroesIcon: {
        default: 'icon/all-heroes.png'
    } as Texture,
    download: {
        default: 'icon/download.png'
    } as Texture,
    upload: {
        default: 'icon/upload.png'
    } as Texture,
    skinIcon: {
        default: 'icon/skin.png'
    } as Texture,
    userId: {
        default: 'icon/user-id.png'
    } as Texture,

    rarityMythic: {
        default: 'icon/rarity/mythic.png'
    } as Texture,
    rarityLegendary: {
        default: 'icon/rarity/legendary.png'
    } as Texture,
    rarityEpic: {
        default: 'icon/rarity/epic.png'
    } as Texture,
    rarityRare: {
        default: 'icon/rarity/rare.png'
    } as Texture,
    rarityCommon: {
        default: 'icon/rarity/common.png'
    } as Texture,
    costumeCustomizable: {
        default: 'icon/costume-customize.webp'
    } as Texture,

    filter: {
        default: 'icon/filter/filter.png',
        active: 'icon/filter/filter-active.png'
    } as Texture,
    filterNone: {
        default: 'icon/filter/filter-none.png',
    } as Texture,
    filterSortAsc: {
        default: 'icon/filter/sort-asc.png',
    } as Texture,
    filterSortDesc: {
        default: 'icon/filter/sort-desc.png',
    } as Texture,
    filterHero: {
        default: 'icon/filter/hero.png'
    } as Texture,
    filterNoGroup: {
        default: 'icon/filter/no-group.png'
    } as Texture,
    filterSource: {
        default: 'icon/filter/source.png'
    } as Texture,
    filterRarity: {
        default: 'icon/filter/rarity.png'
    } as Texture,
    filterRaritySortUp: {
        default: 'icon/filter/rarity-sort-up.png'
    } as Texture,
    filterRaritySortDown: {
        default: 'icon/filter/rarity-sort-down.png'
    } as Texture,
    filterChecked: {
        default: 'icon/filter/checked.png'
    } as Texture,
    filterCategories: {
        default: 'icon/filter/categories.png'
    } as Texture,
    filterTheme: {
        default: 'icon/filter/theme.png'
    } as Texture,
    filterTimeUp: {
        default: 'icon/filter/time-up.png'
    } as Texture,
    filterTimeDown: {
        default: 'icon/filter/time-down.png'
    } as Texture,
    sortAZ: {
        default: 'icon/filter/sort-az.png'
    } as Texture,
    sortZA: {
        default: 'icon/filter/sort-za.png'
    } as Texture,
    filterNoSearch: {
        default: 'icon/filter/no-search.png'
    } as Texture,
    filterSearch: {
        default: 'icon/filter/search.png'
    } as Texture,

    achievementsIcon: {
        default: 'icon/achievement/achievements.png'
    } as Texture,
    careerAchievements: {
        default: 'icon/career-achievements.png'
    } as Texture,
    careerAchievementsGray: {
        default: 'icon/career-achievements-gray.png'
    } as Texture,
    achievementPoint: {
        default: 'icon/achievement-point.png'
    } as Texture,
    achievementRewardProgress: {
        default: 'icon/achievement-reward-uncompleted.png',
        active: 'icon/achievement-reward-completed.png'
    } as Texture,

    achievementChronoverseSaga: {
        default: 'icon/achievement/chronoverse-saga.png'
    } as Texture,
    achievementChronoverseSagaCopper: {
        default: 'icon/achievement/chronoverse-saga-copper.png'
    } as Texture,
    achievementChronoverseSagaSilver: {
        default: 'icon/achievement/chronoverse-saga-silver.png'
    } as Texture,
    achievementChronoverseSagaGold: {
        default: 'icon/achievement/chronoverse-saga-gold.png'
    } as Texture,

    achievementGalactaGuide: {
        default: 'icon/achievement/galacta-guide.png'
    } as Texture,
    achievementGalactaGuideCopper: {
        default: 'icon/achievement/galacta-guide-copper.png'
    } as Texture,
    achievementGalactaGuideSilver: {
        default: 'icon/achievement/galacta-guide-silver.png'
    } as Texture,
    achievementGalactaGuideGold: {
        default: 'icon/achievement/galacta-guide-gold.png'
    } as Texture,

    achievementHeroicJourney: {
        default: 'icon/achievement/heroic-journey.png'
    } as Texture,
    achievementHeroicJourneyCopper: {
        default: 'icon/achievement/heroic-journey-copper.png'
    } as Texture,
    achievementHeroicJourneySilver: {
        default: 'icon/achievement/heroic-journey-silver.png'
    } as Texture,
    achievementHeroicJourneyGold: {
        default: 'icon/achievement/heroic-journey-gold.png'
    } as Texture,

    achievementRivalryRising: {
        default: 'icon/achievement/rivalry-rising.png'
    } as Texture,
    achievementRivalryRisingCopper: {
        default: 'icon/achievement/rivalry-rising-copper.png'
    } as Texture,
    achievementRivalryRisingSilver: {
        default: 'icon/achievement/rivalry-rising-silver.png'
    } as Texture,
    achievementRivalryRisingGold: {
        default: 'icon/achievement/rivalry-rising-gold.png'
    } as Texture,


    discordIcon: {
        default: 'icon/discord.png'
    } as Texture,

    whiteBackground: {
        default: 'bg/white.webp'
    } as Texture,
    darkBackground: {
        default: 'bg/dark.png'
    } as Texture,
    commonBackground: {
        default: 'bg/common-bg.webp'
    } as Texture,
    biColorBackground: {
        default: 'bg/bi-color-bg.webp'
    } as Texture,
    promotionalBackground: {
        default: 'bg/promotional-bg.webp',
    } as Texture,
    lordsBackground: {
        default: 'bg/bg-lords.webp',
    } as Texture,
    dropdownHover: {
        default: 'bg/dropdown-hover.png'
    } as Texture,
    smallButtonBg: {
        default: 'bg/small-button-bg.png'
    } as Texture,
    popup: {
        default: 'bg/popup.png'
    } as Texture,
    heroCardBackground: {
        default: 'bg/hero-card-bg.webp',
        hover: 'bg/hero-card-hover.webp'
    } as Texture,
    heroCardFeatured: {
        default: 'bg/hero-featured-card.webp',
        hover: 'bg/hero-featured-card-hover.webp',
    } as Texture,
    heroCardBorder: {
        default: 'bg/hero-card-border.png'
    } as Texture,
    notification: {
        default: 'bg/notification.png'
    } as Texture,
    popupGoldUpRight: {
        default: 'bg/popup-gold-up-right.png'
    } as Texture,
    popupGoldDownLeft: {
        default: 'bg/popup-gold-down-left.png'
    } as Texture,
    popupGoldDownRight: {
        default: 'bg/popup-gold-down-right.png'
    } as Texture,
    popupGoldUpLeft: {
        default: 'bg/popup-gold-up-left.png'
    } as Texture,
    popupGoldLeft: {
        default: 'bg/popup-gold-left.png'
    } as Texture,
    popupGoldRight: {
        default: 'bg/popup-gold-right.png'
    } as Texture,
    barBackground: {
        default: 'bg/bar-bg.webp'
    } as Texture,
    heroProficiencyLevel: {
        default: 'bg/hero-proficiency-level.png'
    } as Texture,
    levelBackground: {
        default: 'bg/level-bg.png'
    } as Texture,
    levelGoldBackground: {
        default: 'bg/level-gold-bg.png'
    } as Texture,
    panelTabsBackground: {
        default: 'bg/panel-tabs-bg.png'
    } as Texture,
    modalBackground: {
        default: 'bg/modal-bg.png'
    } as Texture,
    itemBackground: {
        default: 'bg/item-bg.png'
    } as Texture,
    allHeroes: {
        default: 'bg/all-heroes.png'
    } as Texture,
    heroSelectFrameGold: {
        default: 'bg/hero-select-frame-gold.png'
    } as Texture,
    heroSelectFrameLeftGold: {
        default: 'bg/hero-select-frame-left-gold.png'
    } as Texture,
    heroSelectFrameRightGold: {
        default: 'bg/hero-select-frame-right-gold.png'
    } as Texture,

    profileHeaderBg: {
        default: 'bg/profile-header-bg.png'
    } as Texture,
    pageLoadingBg: {
        default: 'bg/page-bg-loading.webp'
    } as Texture,

    listItemHover: {
        default: 'bg/list-item-hover.png'
    } as Texture,
    listItemSelected: {
        default: 'bg/list-item-selected.png'
    } as Texture,
    listItemIconHover: {
        default: 'bg/list-item-icon-hover.png',
    } as Texture,
    listItemIconSelected: {
        default: 'bg/list-item-icon-selected.png',
    } as Texture,
    listItemDecorationSelected: {
        default: 'bg/list-item-decoration-selected.png'
    } as Texture,

    promotionalBackgroundMask: {
        default: 'mask/promotional-bg-mask.png',
    } as Texture,
    promotionalBackgroundMaskInverted: {
        default: 'mask/promotional-bg-mask-inverted.png',
    } as Texture,
    barBackgroundMask: {
        default: 'mask/bar-bg-mask.webp'
    } as Texture,
    heroCardMask: {
        default: 'mask/hero-card-mask.png'
    } as Texture,
    heroFeaturedMask: {
        default: 'mask/hero-featured-card-mask.png'
    } as Texture,
    heroPrestigeMask: {
        default: 'mask/hero-prestige.webp'
    } as Texture,
    heroDisplayMask: {
        default: 'mask/hero-display.webp'
    } as Texture,
    prestigeBackgroundMask: {
        default: 'mask/prestige-bg.webp'
    } as Texture,
    prestigeLeftMask: {
        default: 'mask/prestige-left.png'
    } as Texture,
    prestigeRightMask: {
        default: 'mask/prestige-right.png'
    } as Texture,
    heroSelectMask: {
        default: 'mask/hero-select-mask.png'
    } as Texture,
    lordGridHeroMask: {
        default: 'mask/lord-grid-hero-mask.png'
    } as Texture,
    ctaMask: {
        default: 'mask/cta-mask.webp'
    } as Texture,
    modalBackgroundMask: {
        default: 'mask/modal-bg-mask.png'
    } as Texture,
    profileCardMask: {
        default: 'mask/profile-card-mask.png'
    } as Texture,



    // LANDING
    promoHeroBackground: {
        default: 'promo/hero.webp'
    } as Texture,
    promoSeparator: {
        default: 'promo/separator.webp'
    } as Texture,
    promoSeparatorFlip: {
        default: 'promo/separator-flip.webp'
    } as Texture,
    promoQuestionBg: {
        default: 'promo/question-bg.webp'
    } as Texture,
    promoFooterBg: {
        default: 'promo/footer.webp'
    } as Texture,
    promoFooterBgMobile: {
        default: 'promo/footer-bg-mobile.webp'
    } as Texture,
    promoCtaTextTexture: {
        default: 'promo/cta-text-texture.png'
    } as Texture,
    promoCtaTextTextureDark: {
        default: 'promo/cta-text-texture-dark.png'
    } as Texture,
    promoGraphBar: {
        default: 'promo/graph-bar.png'
    } as Texture,
    promoSprayMask: {
        default: 'promo/spray-mask.webp'
    } as Texture,
    promoTriangleOverlay: {
        default: 'promo/triangle-overlay.png'
    } as Texture,
    promoTriangleMask: {
        default: 'promo/triangle-mask.png'
    } as Texture,
    promoYellowLine: {
        default: 'promo/yellow-line.png'
    } as Texture,
    promoHeroDetailsBg: {
        default: 'promo/hero-details-bg.png'
    } as Texture,
    promoHeroNameplate: {
        default: 'promo/hero-nameplate.png'
    } as Texture,
    promoFeaturedBar: {
        default: 'promo/featured-bar.png',
        active: 'promo/featured-bar-active.png'
    } as Texture,


    nameplateBackground: {
        default: 'bg/nameplate-bg.png'
    } as Texture,
    cosmeticsListItemHover: {
        default: 'bg/cosmetics-list-item-hover.png'
    } as Texture,
    cosmeticsListItemSelected: {
        default: 'ui/cosmetics-list-item-selected.png'
    } as Texture,
    cosmeticsGridItemSelected: {
        default: 'ui/cosmetics-grid-item-selected.png'
    } as Texture,

} satisfies  Record<string, Texture>;

export type TextureKey = keyof typeof TEX;

export function tex(textureKey: TextureKey, state: keyof Texture = 'default') {
    return '/img/tex/' + (TEX[textureKey][state] ?? TEX[textureKey].default);
}
export function texUrl(textureKey: TextureKey, state: keyof Texture = 'default') {
    return `url('${tex(textureKey, state)}')`;
}

const texAsCssVars: Record<string, string> = {};
Object.entries(TEX).forEach(([key, tex]) => {
    texAsCssVars[`--tex-${key}`] = `url('/img/tex/${tex.default}\')`;

    if (tex.hover)
        texAsCssVars[`--tex-${key}-hover`] = `url('/img/tex/${tex.hover}\')`;
    if (tex.active)
        texAsCssVars[`--tex-${key}-active`] = `url('/img/tex/${tex.active}\')`;
})

export const TEX_AS_CSS_VARS = texAsCssVars;

export function injectTexturesCss(manual = false) {
    let texAsCssVarsCss = ":root{";
    Object.entries(TEX_AS_CSS_VARS).forEach(([key, value]) => {
        texAsCssVarsCss += `${key}:${value};`;
    })
    texAsCssVarsCss += "}"

    if (manual) {
        const style = document.createElement('style');
        style.innerText = texAsCssVarsCss;
        document.head.appendChild(style)
    }
    else
        useHead({
            style: [{ innerHTML: texAsCssVarsCss }]
        })
}