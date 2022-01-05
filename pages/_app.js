function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
        }

        * {
          font-family: Inter;
        }

        :root {
          --from-color: #00f260;
          --to-color: #0575e6;
          --lightgray: #eee;
          --gray: #555;
          --bordergray: lightgray;
          --skeletongray: #d1d1d1;
          --red: #ff4b4b;
          --loadinggray: #c0c0c0;
          --imageskeletongray: #e0e0e0;
          --protipgray: #d8d8d8;
        }
      `}</style>
    </>
  );
}

export default MyApp;
