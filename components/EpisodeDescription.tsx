import styles from './EpisodeDescription.module.css'

export function EpisodeDescription({ html }: { html: string }) {
  return (
    <div
      className={styles.description}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
