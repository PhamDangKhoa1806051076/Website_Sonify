export interface Song {
    id: number | string;
    title: string;
    artist: string;
    cover: string;
    src: string;
    isOnline?: boolean;
    category?: string;
}

export const songs: Song[] = [
    {
        id: 1,
        title: "4 Mùa Thương Em",
        artist: "Lập Nguyên",
        cover: "/img/4muathuongem.jpg",
        src: "/sound/4muathuongem-lapnguyen.mp3"
    },
    {
        id: 2,
        title: "Anh Thanh Niên",
        artist: "HuyR",
        cover: "/img/anhthanhnien.jpg",
        src: "/sound/anhthanhnien-huyr.mp3"
    },
    {
        id: 3,
        title: "Còn Gì Đẹp Hơn (BCN)",
        artist: "Bùi Công Nam, Nguyễn Hùng",
        cover: "/img/congidephon-bcn.jpg",
        src: "/sound/congidephon-buicongnam-nguyenhung.mp3"
    },
    {
        id: 4,
        title: "Còn Gì Đẹp Hơn",
        artist: "Nguyễn Hùng",
        cover: "/img/congidephon.jpg",
        src: "/sound/congidephon-nguyenhung.mp3"
    },
    {
        id: 5,
        title: "Em Ổn Không",
        artist: "Thiên An",
        cover: "/img/emonkhong.jpg",
        src: "/sound/emonkhong-thienan.mp3"
    },
    {
        id: 6,
        title: "Giờ Thì",
        artist: "Bùi Trường Linh",
        cover: "/img/giothi.jpg",
        src: "/sound/giothi-buitruonglinh.mp3"
    },
    {
        id: 7,
        title: "Người Có Thương",
        artist: "Đạt Kaa",
        cover: "/img/nguoicothuong.jpg",
        src: "/sound/nguoicothuong-datkaa.mp3"
    },
    {
        id: 8,
        title: "Người Em Cố Đô",
        artist: "Rum, Xuân Định",
        cover: "/img/nguoiemcodo.jpg",
        src: "/sound/nguoiemcodo-rum-xuandinh.mp3"
    },
    {
        id: 9,
        title: "Nhà Tôi Có Treo Một Lá Cờ",
        artist: "Hà Anh Tuấn",
        cover: "/img/nhatoicotreomotlaco.jpg",
        src: "/sound/nhatoicotreomotlaco-haanhtuan.mp3"
    },
    {
        id: 10,
        title: "Phép Màu",
        artist: "Nguyễn Hùng",
        cover: "/img/phepmau.jpg",
        src: "/sound/phepmau-nguyenhung.mp3"
    },
    {
        id: 11,
        title: "Phố Cũ Còn Anh",
        artist: "Quinn",
        cover: "/img/phocuconanh.jpg",
        src: "/sound/phocuconanh-quinn.mp3"
    },
    {
        id: 12,
        title: "Thịnh Vượng Việt Nam Sáng Ngời",
        artist: "V.A",
        cover: "/img/thinhvuongvietnamsangngoi.jpg",
        src: "/sound/thinhvuongvietnamsangngoi.mp3"
    },
    {
        id: 13,
        title: "Yêu Được Không",
        artist: "Đức Phúc",
        cover: "/img/yeuduockhong.jpg",
        src: "/sound/yeuduockhong-ducphuc.mp3"
    },
    {
        id: 14,
        title: "Phù Hộ Cho Con",
        artist: "24k.Right ft. B-Ray",
        cover: "/img/chuaphuhocon.jpg",
        src: "/sound/24k-right-phu-ho-cho-con-feat-b-ray-huynh-cong-hieu-hipz-official-music-video-24kright.mp3"
    },
    {
        id: 15,
        title: "Ex's Hate Me Part 2",
        artist: "Amee x B-Ray",
        cover: "/img/ex-s-hate-me.jpg",
        src: "/sound/amee-x-b-ray-ex-s-hate-me-part-2-lyric-video-from-album-dreamee-st-319-entertainment.mp3"
    },
    {
        id: 16,
        title: "Pin Dự Phòng",
        artist: "Dương Domic ft. Lou Hoàng",
        cover: "/img/pinduphong.jpg",
        src: "/sound/duong-domic-ft-lou-hoang-pin-du-phong-ep-du-lieu-quy-duong-domic.mp3"
    },
    {
        id: 17,
        title: "Dạo Này",
        artist: "Obito",
        cover: "/img/daonay.jpg",
        src: "/sound/obito-dao-nay-official-music-video-obito-official.mp3"
    },
    {
        id: 18,
        title: "Ôm Em Thật Lâu",
        artist: "MONO",
        cover: "/img/omemthatlau.jpg",
        src: "/sound/mono-om-em-that-lau-official-music-video-mono-official.mp3"
    },
    {
        id: 19,
        title: "Daylight",
        artist: "David Kushner",
        cover: "/img/daylight.jpg",
        src: "/sound/david-kushner-daylight-official-music-video-davidkushnervevo.mp3"
    },
    {
        id: 20,
        title: "Miss You",
        artist: "Oliver Tree & Robin Schulz",
        cover: "/img/missyou.jpg",
        src: "/sound/oliver-tree-robin-schulz-miss-you-official-music-video-oliver-tree.mp3"
    },
    {
        id: 21,
        title: "I Just Might",
        artist: "Bruno Mars",
        cover: "/img/ijustmight.jpg",
        src: "/sound/bruno-mars-i-just-might-official-music-video-bruno-mars.mp3"
    },
    {
        id: 22,
        title: "Da Key",
        artist: "Gurbane",
        cover: "/img/da-key.jpg",
        src: "/sound/2-da-key-gurbane-official-audio-all-black-records.mp3"
    },
    {
        id: 23,
        title: "Lemmeholla",
        artist: "Gnob",
        cover: "/img/lemmeholla.jpg",
        src: "/sound/gnob-lemmeholla-prod-prod-april16-official-mv-gnob.mp3"
    },
    {
        id: 24,
        title: "Gợi Anh Đây",
        artist: "Binz",
        cover: "/img/goianhday.jpg",
        src: "/sound/go-anh-day-binz-binz-da-poet.mp3"
    },
    {
        id: 25,
        title: "Hello Em Có Khỏe Không",
        artist: "Dfoxie37 x MyHoa",
        cover: "/img/helloemcokhoekhong.jpg",
        src: "/sound/hello-em-co-khoe-khong-mp3-dfoxie37-myhoa-tuann-dfoxie37.mp3"
    },
    {
        id: 26,
        title: "Tokyo Cypher",
        artist: "Lil Wuyn x 16 Typh",
        cover: "/img/tokyocypher.jpg",
        src: "/sound/lil-wuyn-16-brt-16-typh-tokyo-cypher-lil-wuyn-official.mp3"
    },
    {
        id: 27,
        title: "An",
        artist: "Lil Wuyn ft. Minstu",
        cover: "/img/an.jpg",
        src: "/sound/lil-wuyn-an-feat-minstu-an-album-lil-wuyn-official.mp3"
    },
    {
        id: 28,
        title: "Chạy Theo Em",
        artist: "Nha (mihuman)",
        cover: "/img/chaytheoem.jpg",
        src: "/sound/nha-mihuman-chay-theo-em-official-music-video-nha-official.mp3"
    },
    {
        id: 29,
        title: "Anh Không Làm Được",
        artist: "Par-SG ft. Vũ Thanh Vân",
        cover: "/img/anhkhonglamduoc.jpg",
        src: "/sound/par-sg-anh-khong-lam-duoc-ft-vu-thanh-van-lyrics-video-par-sg.mp3"
    },
    {
        id: 30,
        title: "Hennessy",
        artist: "Par-SG ft. Saabirose",
        cover: "/img/henessy.jpg",
        src: "/sound/par-sg-hennessy-ft-saabirose-official-music-video-par-sg.mp3"
    },
    {
        id: 31,
        title: "Dalat Mango",
        artist: "PC",
        cover: "/img/dalat-mango.jpg",
        src: "/sound/pc-dalatmango-prod-just-big-hills-official-mv-pc-feelingsoundz.mp3"
    },
    {
        id: 32,
        title: "Back to Friends",
        artist: "Sombr",
        cover: "/img/backtofriend.jpg",
        src: "/sound/sombr-back-to-friends-official-video-sombr.mp3"
    },
    {
        id: 33,
        title: "Tương Tư",
        artist: "Clow x Flepy",
        cover: "/img/tuongtu.jpg",
        src: "/sound/tuong-tu-clow-x-flepy-ft-darkc-official-video-clow.mp3"
    },
    {
        id: 34,
        title: "Tửu Sầu",
        artist: "Xám x D-Blue",
        cover: "/img/tuusau.jpg",
        src: "/sound/tuu-sau-xam-x-d-blue-official-lyric-video-dblue-official.mp3"
    },
    {
        id: 35,
        title: "Người Bất An",
        artist: "Ultimit",
        cover: "/img/nguoibatan.jpg",
        src: "/sound/ultimit-nguoi-bat-an-1337-battle.mp3"
    },
    {
        id: 36,
        title: "Vùng An Toàn",
        artist: "B-Ray",
        cover: "/img/vungantoan.jpg",
        src: "/sound/vung-an-toan-b-ray.mp3"
    }
];

export const translations = {
    vi: {
        "nav-home": "Trang chủ",
        "nav-recent": "Nghe gần đây",
        "nav-explore": "Khám phá",
        "nav-library": "Thư viện",
        "playlist-title": "PLAYLIST CỦA BẠN",
        "nav-liked": "Bài hát đã thích",
        "search-placeholder": "Tìm kiếm bài hát, nghệ sĩ...",
        "header-login": "Đăng nhập",
        "hero-title": "Khám phá âm nhạc mới",
        "hero-subtitle": "Hàng ngàn bài hát đang chờ đợi bạn tại Sonify.",
        "btn-play-all": "Phát tất cả",
        "song-list-title": "Danh sách bài hát",
        "song-count": "bài hát",
        "settings-lang": "Ngôn ngữ",
        "settings-feedback": "Góp ý",
        "settings-theme": "Giao diện",
        "settings-back": "Quay lại",
        "profile-title": "Hồ sơ của tôi",
        "profile-tracks": "Bài hát",
        "profile-liked": "Đã thích",
        "nav-profile": "Hồ sơ",
        "nav-logout": "Đăng xuất",
        "lang-en": "English",
        "lang-vi": "Tiếng Việt",
        "nav-admin": "Quản trị viên",
        "nav-user": "Người dùng",
        "theme-dark": "Tối",
        "theme-light": "Sáng",
        "theme-system": "Hệ thống",
        "theme-blue": "Xanh dương",
        "search-local": "Nhạc trong máy",
        "search-online": "Kết quả trực tuyến",
        "online-track": "Trực tuyến",
        "searching": "Đang tìm kiếm...",
        "nav-charts": "Bảng xếp hạng",
        "charts-trending": "Top 50 Bài Hát Thịnh Hành",
        "charts-vietnam": "Top 50 Nhạc Việt",
        "charts-chinese": "Top 50 Nhạc Hoa",
        "charts-usuk": "Top 50 Nhạc US/UK"
    },
    en: {
        "nav-home": "Home",
        "nav-recent": "Recently Played",
        "nav-explore": "Explore",
        "nav-library": "Library",
        "playlist-title": "YOUR PLAYLIST",
        "nav-liked": "Liked Songs",
        "search-placeholder": "Search songs, artists...",
        "header-login": "Sign In",
        "hero-title": "Discover New Music",
        "hero-subtitle": "Thousands of songs are waiting for you at Sonify.",
        "btn-play-all": "Play All",
        "song-list-title": "Song List",
        "song-count": "songs",
        "settings-lang": "Language",
        "settings-feedback": "Feedback",
        "settings-theme": "Theme",
        "settings-back": "Back",
        "profile-title": "My Profile",
        "profile-tracks": "Tracks",
        "profile-liked": "Liked",
        "nav-profile": "Profile",
        "nav-logout": "Logout",
        "lang-en": "English",
        "lang-vi": "Vietnamese",
        "nav-admin": "Admin",
        "nav-user": "User view",
        "theme-dark": "Dark",
        "theme-light": "Light",
        "theme-system": "System",
        "theme-blue": "Blue",
        "search-local": "Local Songs",
        "search-online": "Online Results",
        "online-track": "Online",
        "searching": "Searching...",
        "nav-charts": "Charts",
        "charts-trending": "Top 50 Trending Songs",
        "charts-vietnam": "Top 50 Vietnam Songs",
        "charts-chinese": "Top 50 Chinese Songs",
        "charts-usuk": "Top 50 US/UK Songs"
    }
};

export const initialUsers = [
    { username: 'admin', password: '1234', name: 'Quản trị viên', role: 'admin' },
    { username: 'user', password: '1234', name: 'người dùng', role: 'user' }
];
