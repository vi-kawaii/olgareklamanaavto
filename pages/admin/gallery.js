import Head from "next/head";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import useUser from "../../utils/user";
import useGallery from "../../utils/gallery";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { GalleryItem, GalleryRow, Skeleton } from "../../components/Gallery";
import prepareImages from "../../utils/prepareImages";
import Image from "next/image";
import Protip from "../../components/Protip";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const router = useRouter();

  const upload = (e) => {
    setIsUpload(true);
    fetch("/api/image/sign")
      .then((res) => res.json())
      .then(({ timestamp, signature }) => {
        [...e.target.files].map((file, i) => {
          const fd = new FormData();

          fd.append("file", file);
          fd.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
          fd.append("timestamp", timestamp);
          fd.append("signature", signature);

          fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: fd }
          )
            .then((res) => res.json())
            .then(({ public_id }) => {
              fetch("/api/image/add", {
                method: "POST",
                body: JSON.stringify({
                  public_id,
                }),
              }).then(() => {
                mutate("/api/image");
                setIsUpload(false);
              });
            });
        });
      });
  };

  const select = (src) => {
    if (selectedImages.includes(src)) {
      setSelectedImages(selectedImages.filter((s) => s !== src));
    } else {
      setSelectedImages([...selectedImages, src]);
    }
  };

  const remove = () => {
    setIsRemoving(true);
    fetch("/api/image/delete", {
      method: "POST",
      body: JSON.stringify(selectedImages),
    }).then(() => {
      mutate("/api/image");
      setSelectedImages([]);
      setIsRemoving(false);
    });
  };

  useEffect(() => {
    let isMounted = true;
    fetch("/api/image")
      .then((res) => res.json())
      .then((res) => {
        if (isMounted) {
          setImages(res);
        }
      });

    return () => (isMounted = false);
  }, []);

  const { mutate } = useSWRConfig();
  const { user, isUserLoading } = useUser();
  const { gallery, isGalleryLoading } = useGallery();

  useEffect(() => {
    if (!isUserLoading && !isGalleryLoading) {
      setImages(gallery);
    }
  }, [gallery, isGalleryLoading, isUserLoading]);

  if (user?.error) {
    router.push("/admin");
  }

  return (
    <>
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={upload}
        disabled={isUpload}
      />
      <Button loading={isUpload} margin="12px 0" labelFor="file-upload">
        Добавить
      </Button>
      {selectedImages.length > 0 && (
        <Button
          loading={isRemoving}
          onClick={remove}
          red
          margin="12px 0 12px 10px"
        >
          Удалить
        </Button>
      )}
      <Protip>Для выделения фото нажмите на него</Protip>
      {isUserLoading || isGalleryLoading ? (
        <Skeleton />
      ) : user.error ? (
        <Skeleton />
      ) : (
        <>
          {prepareImages(images).map((row, i) => (
            <GalleryRow key={i}>
              {row.map((src, j) => (
                <GalleryItem
                  onClick={() => (src ? select(src) : undefined)}
                  key={j}
                >
                  {src && (
                    <>
                      <Image
                        alt=""
                        objectFit="cover"
                        src={src}
                        layout="fill"
                        sizes="33vw"
                      />
                      {selectedImages.includes(src) && (
                        <svg
                          viewBox="0 0 200 200"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ position: "absolute" }}
                        >
                          <rect
                            width="200"
                            height="200"
                            fill="black"
                            fillOpacity="0.3"
                          />
                          <path
                            d="M73 98L93 118L130 81"
                            stroke="white"
                            strokeWidth="4"
                          />
                        </svg>
                      )}
                    </>
                  )}
                </GalleryItem>
              ))}
            </GalleryRow>
          ))}
        </>
      )}
      <style jsx>{`
        #file-upload {
          opacity: 0;
          width: 0;
        }

        label {
          height: 100%;
        }

        span {
          margin-left: 20px;
        }
      `}</style>
      <style global jsx>{`
        body {
          overflow-y: scroll;
        }
      `}</style>
    </>
  );
}

GalleryPage.getLayout = function getLayout(page) {
  return (
    <Layout active="Галерея">
      <Head>
        <title>Галерея - Olga</title>
      </Head>
      {page}
    </Layout>
  );
};
