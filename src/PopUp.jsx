import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import Toggle from "./Toggle";
import { useEffect, useState } from "react";

export const PopUp = () => {
  const largeIcon = {
    fontSize: 60,
  };
  const mdIcon = {
    fontSize: 35,
    fontWeight: "thin",
  };
  const smIcon = {
    fontSize: 28,
  };

  const [currentTab, setCurrentTab] = useState(true);
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const [settings, setSettings] = useState(true);
  const [chromeId, setChromeId] = useState(null);
  const [showChromeID, setShowChromeID] = useState(false);

  const handleScreen = () => {
    setCurrentTab((p) => !p);
  };

  useEffect(() => {
    // chrome.storage.sync.get("userid", function (items) {
    //   setChromeId(items.userid);
    // });
  }, []);

  const startCamera = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "startCamera",
        });
      } else {
        console.log("No active tab");
      }
    });
  };

  const stopCamera = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "stopCamera",
        });
      } else {
        console.log("No active tab");
      }
    });
  };

  const allowMic = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "allowMic",
        });
      } else {
        console.log("No active tab");
      }
    });
  };

  const disableMic = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "disableMic",
        });
      } else {
        console.log("No active tab");
      }
    });
  };

  const start = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "start",
            currentTab: currentTab,
            chromeId: chromeId,
            video: video,
            audio: audio,
          },
          function () {
            if (!chrome.runtime.lastError) {
              window.close();
            }
          }
        );
      } else {
        console.log("No active tab");
      }
    });
  };
  const handelVideoToggle = () => {
    if (!video) {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const handleMicToggle = () => {
    setAudio((p) => !p);
    if (audio) {
      allowMic();
    } else {
      disableMic();
    }
  };

  return (
    <main className="min-w-[350px] flex flex-col gap-4">
      <div className="flex flex-col justify-center items-start w-full gap-5 py-5 px-7">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2 justify-center items-center t hover:link">
            <img src="icon.png" className="w-[30px]" />
            <h1 className="text-xl font-semibold">HelpMeOut</h1>
          </div>
          <div className="flex gap-2">
            <button
              className="t hover:link"
              onClick={() => setSettings((p) => !p)}
            >
              <SettingsOutlinedIcon sx={smIcon} />
            </button>
            <span
              className="t hover:text-primary"
              onClick={() => window.close()}
            >
              <CancelOutlinedIcon
                sx={smIcon}
                className="opacity-25 t hover:opacity-100 hover:t"
              />
            </span>
          </div>
        </div>
        <p className="my-2 text-[#413c6d]">
          This extension helps you record and share help videos with ease.
        </p>
        <div className="flex justify-center items-center w-full gap-10">
          <div
            onClick={handleScreen}
            className={`t flex flex-col justify-center items-center ${
              !currentTab ? "active" : "inactive"
            }`}
          >
            <span>
              <DesktopWindowsRoundedIcon id="full" sx={largeIcon} />
            </span>
            <p className="font-semibold cursor-text">Full screen</p>
          </div>
          <div
            onClick={handleScreen}
            className={`t hover:link flex flex-col justify-center items-center ${
              currentTab ? "active" : "inactive"
            }`}
          >
            <span>
              <img
                id="tab"
                src="copy.svg"
                className={`w-[60px] t hover:link ${
                  currentTab ? "active" : "inactive"
                }`}
              />
            </span>
            <p className="font-semibold cursor-text">Current Tab</p>
          </div>
        </div>

        {settings && (
          <div className="w-full">
            <div className="flex justify-between w-full border-2 border-primary rounded-2xl p-3 mb-5">
              <div className="flex justify-center items-center gap-2">
                <span>
                  <VideocamOutlinedIcon sx={mdIcon} />
                </span>
                <p className="font-semibold">Web cam</p>
              </div>
              <div className="flex flex-col justify-center items-center ">
                <div
                  className="md:w-14 md:h-7 w-12 h-6 flex items-center bg-primary rounded-full p-1 cursor-pointer t hover:bg-secondary"
                  onClick={() => {
                    setVideo((p) => !p);
                    handelVideoToggle();
                  }}
                >
                  <div
                    className={`aspect-square h-4 md:h-5 w-4 md:w-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                      video
                        ? "transform md:translate-x-7 translate-x-6 bg-white"
                        : "bg-primary300"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between w-full border-2 border-primary rounded-2xl p-3">
              <div className="flex justify-center items-center gap-2">
                <span>
                  <MicNoneOutlinedIcon sx={mdIcon} />
                </span>
                <p className="font-semibold">Mic audio</p>
              </div>
              <div className="flex flex-col justify-center items-center ">
                <div
                  className="md:w-14 md:h-7 w-12 h-6 flex items-center bg-primary rounded-full p-1 cursor-pointer t hover:bg-secondary"
                  onClick={() => {
                    handleMicToggle();
                  }}
                >
                  <div
                    className={`aspect-square h-4 md:h-5 w-4 md:w-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                      audio
                        ? "transform md:translate-x-7 translate-x-6 bg-white"
                        : "bg-primary300"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={start}
          className="bg-primary w-full text-white rounded-2xl h-[50px] hover:btn-link hover:bg-secondary t"
        >
          Start Recording
        </button>
        <p
          onClick={() => setShowChromeID((p) => !p)}
          className="grid place-content-center font-semibold border-2 text-gray-400 rounded-lg hover:btn-link px-2 py-2 t text-xs"
        >
          Show chrome id
        </p>
        {showChromeID && (
          <span className="text-[10px] break-all max-w-full border-2">
            {chromeId}
          </span>
        )}
        {/* {error && (
          <p className="text-red-500 text-center text-sm font-semibold">
            {error}
          </p>
        )} */}
      </div>
    </main>
  );
};
