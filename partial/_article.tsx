import articleType from '../types/article.type';
import useThumbnail from './_useThumbnail';
import styles from '../styles/Article.module.css';
import { useEffect, useMemo, useState } from 'react';

export default function SingleArticle({ article }: any) {
    const [_article, setArticle] = useState(article);
    const nail = useThumbnail(article.nail, article.url, article.isThumbnailTried);

    useMemo(() => {
        setArticle((prev: articleType) => ({ ...prev, nail: nail, isThumbnailTried: true }));
    }, [article])

    return (<div className={styles.content}>
        <div className={styles.thumbnail} style={{ backgroundImage: `url(${nail})` }}>
        </div>
        <div className={styles.textContainer}>
            <h1 className={styles.title}>
                {article.title}
            </h1>
            <div className={styles.info}>
                <small className={styles.author}>
                    {article.author}
                </small>
                <br />
                <small className={styles.editStatus}>
                    {`Created on ${new Date(article.createdAt)?.toDateString()} - Updated on ${new Date(article.updatedAt)?.toDateString()}`}
                </small>
            </div>

            <p className={styles.description}>
                {article.text}
            </p>

            <div className={styles.grid}>
                {/* {article.score && <small className={styles.score}>
                    {article.score}
                </small>} */}
                {article.url ? <a href={article.url} className={styles.card} target="__blank" rel="no-referrer no-opener">
                    Read this article
                </a> : <span className={styles.nolink}>Link not found</span>}
            </div>
        </div>
    </div >)
}
