export function Skeleton() {
  return (
    <>
      <GalleryRow>
        <GalleryItem>
          <div></div>
        </GalleryItem>
        <GalleryItem>
          <div></div>
        </GalleryItem>
        <GalleryItem>
          <div></div>
        </GalleryItem>
      </GalleryRow>
      <GalleryRow>
        <GalleryItem>
          <div></div>
        </GalleryItem>
        <GalleryItem>
          <div></div>
        </GalleryItem>
        <GalleryItem>
          <div></div>
        </GalleryItem>
      </GalleryRow>
      <style jsx>{`
        div {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--skeletongray);
        }
      `}</style>
    </>
  );
}

export function GalleryItem({ children }) {
  return (
    <div>
      {children}
      <style jsx>{`
        div {
          height: 250px;
          width: 250px;
          position: relative;
          margin-right: 10px;
        }

        div:last-child {
          margin-right: 0;
        }
      `}</style>
    </div>
  );
}

export function GalleryRow({ children }) {
  return (
    <div>
      {children}
      <style jsx>{`
        div {
          display: flex;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
