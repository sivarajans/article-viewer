import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Articles from '../partial/_articles'


const Home: NextPage = () => {

  function changeTheme() {
    // Just simple theme is given, but in real world it is different css files
    if (document.body.classList.value.indexOf("dark") >= 0) {
      document.body.classList.remove("dark")
      document.body.classList.add("white")
    } else {
      document.body.classList.remove("white")
      document.body.classList.add("dark")
    }
  }

  return (
    <div className={styles.container}>

      <Head>
        <title>Article Viewer</title>
        <meta name="author" content="Sivarajan Sivanesan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} >
        <div className='themeButton' onClick={changeTheme}>Theme Toggle</div>
        <h1>Articles</h1>
        <div className='articles'>
          <Articles ></Articles>
        </div>
      </main>

      <footer className={styles.footer}>
        Article Viewer - Sample Application
      </footer>
    </div>
  )
}

export default Home
