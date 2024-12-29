import { useTranslation } from 'react-i18next'

import GameContent from '@/components/Game'

const GamePage = () => {
    const i18nPath = 'game'
    const titlePath = `${i18nPath}:title`

    const { t } = useTranslation([ i18nPath ])

    document.title = t( titlePath )
    return (
        <>
            <div className="game-page">
                <GameContent t={t} i18nPath={i18nPath} />
            </div>
        </>
    )
}

export default GamePage
