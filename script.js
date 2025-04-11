document.addEventListener('DOMContentLoaded', function () {
  const lottieContainer = document.getElementById('lottie-container');
  const blurFilter = document.querySelector('#edge-blur feGaussianBlur');
  let blurAmount = 0; // 현재 블러 강도를 초기화합니다.
  const maxBlur =20; // 최대 블러 강도를 설정합니다.

  let previousX = null; // 이전 마우스 X 좌표 저장
  let isPlaying = false; // 애니메이션 재생 중 여부 확인
  const motionThreshold =5 // 마우스 좌우 이동 감지 기준값 (px)

  const animation = lottie.loadAnimation({
    container: lottieContainer, // 애니메이션 컨테이너
    renderer: 'svg',
    loop: false, // 애니메이션 반복 설정
    autoplay: false, // 자동 재생 금지
    path: 'main.json', // 애니메이션 JSON 경로
  });

  lottieContainer.addEventListener('mousemove', (e) => {
    const currentX = e.clientX; // 현재 마우스 X 좌표

    if (previousX !== null) {
      const deltaX = Math.abs(currentX - previousX); // X 좌표 변화량 계산

      if (deltaX > motionThreshold) {
        if (!isPlaying) {
          animation.play(); // 좌우 흔들림 감지 시 애니메이션 재생
          isPlaying = true;
        }
      } else if (isPlaying) {
        animation.pause(); // 흔들림이 없으면 일시 정지
        isPlaying = false;
      }
    }

    previousX = currentX; // 현재 X 좌표를 이전 X로 업데이트
  });

  // Lottie 컨테이너 내에서 마우스를 움직일 때 처리
  lottieContainer.addEventListener('mousemove', (e) => {
    const rect = lottieContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lottieContainer.style.setProperty('--x', `${x}px`); // X 좌표 설정
    lottieContainer.style.setProperty('--y', `${y}px`); // Y 좌표 설정
    blurAmount = Math.min(blurAmount + 0.1, maxBlur); // 블러 강도를 점진적으로 증가
    blurFilter.setAttribute('stdDeviation', blurAmount); // SVG 블러 필터 적용
  });

  // Lottie 컨테이너에서 마우스가 벗어났을 때 처리
  lottieContainer.addEventListener('mouseleave', () => {
    animation.pause(); // 애니메이션 일시 정지
    lottieContainer.style.setProperty('--size', '0px'); // 그라디언트 크기 초기화
  });

  document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.className = 'trail';
    trail.style.left = `${e.pageX}px`;
    trail.style.top = `${e.pageY}px`;
    document.body.appendChild(trail);

    // 일정 시간 후 trail 요소 제거
    setTimeout(() => {
      trail.remove();
    }, 1000); // fadeOut 애니메이션 시간과 일치
  });
});