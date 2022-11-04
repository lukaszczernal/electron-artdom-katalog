import React from "react";
import { Modal } from "@mantine/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper";
import { Page } from "@/models";
import { Thumbnail } from "../Thumbnail";

import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/navigation";

interface Props {
  onClickOutside: () => void;
  selectedPage: Page;
  sourcePath: string; // TODO this should be accessible via global context
  pages: Page[];
}

const PagePreview: React.FC<Props> = ({
  pages,
  sourcePath,
  onClickOutside,
}) => {
  return (
    <Modal fullScreen opened onClose={onClickOutside}>
      <Swiper
        modules={[Navigation, Keyboard]}
        keyboard
        navigation
        spaceBetween={50}
        slidesPerView={1}
        style={{ zIndex: 201, position: "relative", height: "100vh" }}
      >
        {pages.map((page) => {
          return (
            <SwiperSlide key={page.svg.file}>
              <Thumbnail
                src={`safe-file-protocol://${sourcePath}/png/${page.svg.file}.png`}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Modal>
  );
};
export default PagePreview;
