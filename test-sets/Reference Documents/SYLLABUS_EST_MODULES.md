# Detailed Interactive Learning Modules Syllabus: ELECTRONICS SYSTEMS & TECHNOLOGIES (EST 01 to EST 10)

> **Philippine ECE Licensure Examination • EST Domain (30% Board Weight)**
> Formatted according to the `learning-module-authoring` skill standards.
> Reference Grounding: `Reference Documents/EST/Notes - Digital Communications 1–5.pdf`, `EST 01-01 to 10-01 Questionnaires & Solutions`.

---

## EST 01: Fundamentals of Communications, Noise & Signal Analysis (6 Modules)
- **Overview & Subject Links**:
  - Fundamentals of communication systems, Fourier spectrum, electromagnetic spectrum, thermal noise ($V_n = \sqrt{4kTRB}$), Signal-to-Noise Ratio ($SNR$), Noise Figure ($NF$), and Friis formula for cascaded noise figure.
  - *Cross-Subject Connections*: Direct link to `MATH 01` (Logarithms & Decibels) and `MATH 02` (Gaussian Noise).

### Granular Module Blueprints:
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `EST 01-01` | **Communication Elements & EM Spectrum** | *"Transmitter modulates, Channel attenuates/adds noise, Receiver demodulates; Frequency and wavelength are inversely related ($c = f\lambda$)."* | Speed of light $c pprox 3 	imes 10^8	ext{ m/s}$; frequency band lookup. | Interactive Electromagnetic Spectrum explorer (ELF to Gamma rays). | `GEAS-07` EM wave propagation speed. |
| `EST 01-02` | **Decibel Power, Voltage & Ratios** | *"Power $dB = 10\log(P_2/P_1)$; Voltage $dB = 20\log(V_2/V_1)$; $+3	ext{dB}$ doubles power, $+10	ext{dB}$ is $10	imes$ power, $0	ext{dBm} = 1	ext{mW}$."* | **Karce**: Log conversion shortcut: $P(	ext{dBm}) = 10\log(P/	ext{1mW})$. | Interactive Decibel Power & Voltage ratio conversion slider. | `MATH-01` Logarithmic manipulation. |
| `EST 01-03` | **Thermal Noise & Johnson-Nyquist Formula** | *"Thermal noise power $N = kTB$; noise voltage $V_n = \sqrt{4kTRB}$; depends only on temperature $T(	ext{K})$ and bandwidth $B(	ext{Hz})$."* | Boltzmann constant $k = 1.38 	imes 10^{-23}	ext{ J/K}$; $T_0 = 290	ext{K} \implies kT_0 pprox 4 	imes 10^{-21}	ext{ W/Hz} = -174	ext{dBm/Hz}$. | Noise Power Spectral Density vs. Bandwidth and Temperature slider. | `GEAS-05` Absolute temperature in Kelvin. |
| `EST 01-04` | **Noise Factor ($F$), Noise Figure ($NF$) & Temp ($T_e$)** | *"$	ext{Noise Figure } NF = 10\log F = 10\log(SNR_{in}/SNR_{out})$; Equivalent noise temperature $T_e = T_0(F - 1)$."* | Linear to dB Noise Figure conversions. | SNR degradation visualizer across a noisy amplifier stage. | `ELEC-10` Low-noise amplifier design. |
| `EST 01-05` | **Cascaded Stages & Friis Noise Formula** | *"Friis: First stage dominates overall noise figure ($F_{sys} = F_1 + rac{F_2 - 1}{G_1} + rac{F_3 - 1}{G_1 G_2}$); keep first stage gain HIGH."* | **Karce**: Setup linear ratios in fractional mode. Convert dB to linear FIRST ($F = 10^{NF/10}, G = 10^{G_{dB}/10}$). | **Multi-Stage Cascade Simulator**: Add amplifier/attenuator blocks to see live system noise figure calculation. | `ELEC-07` Multi-stage cascaded BJT amplifiers. |
| `EST 01-06` | **Information Theory & Shannon-Hartley Capacity** | *"Hartley-Shannon Theorem: Maximum error-free channel capacity is $C = B \log_2(1 + SNR)$."* | Base-2 log evaluation: $\log_2(x) = rac{\ln x}{\ln 2}$. | Channel Capacity vs. Bandwidth & SNR trade-off curve. | `MATH-02` Probability and entropy. |

---

## EST 02: Radiowave Propagation (3 Modules)
- **Key Modules**:
  - `EST 02-01` Free Space Propagation, Inverse Square Law, Path Loss ($FSL = 32.44 + 20\log d_{	ext{km}} + 20\log f_{	ext{MHz}}$).
  - `EST 02-02` Ground Wave, Space Wave (Line-of-Sight $d = \sqrt{2 h_t} + \sqrt{2 h_r}$ statute miles / $d = \sqrt{17 h_t} + \sqrt{17 h_r}	ext{ km}$), Radio Horizon (effective Earth radius $K = 4/3$).
  - `EST 02-03` Sky Wave Propagation: Ionosphere layers (D, E, F1, F2), Critical Frequency ($f_c$), Maximum Usable Frequency ($	ext{MUF} = f_c \sec	heta_i$), Skip Distance & Virtual Height.
- **Mental Anchor**: *"Skywaves refract off ionosphere layers; MUF is always greater than critical frequency ($f_c$) by the secant of incident angle."*
- **Notable Visualizer**: **Ionospheric Layer Refraction Simulator**: Drag wave incident angle $	heta_i$ to see skywave bounce off F2 layer or penetrate into outer space.

---

## EST 03: Analog Modulation — AM, FM, PM (3 Modules)
- **Key Modules**:
  - `EST 03-01` Amplitude Modulation: Modulation index $m = rac{V_m}{V_c}$, AM spectrum ($f_c, f_c \pm f_m$), Total power $P_t = P_c(1 + m^2/2)$, AM DSB-SC, SSB, VSB.
  - `EST 03-02` Frequency Modulation (FM): Frequency deviation ($\Delta f = k_f V_m$), Modulation index $m_f = rac{\Delta f}{f_m}$, Carson's Bandwidth Rule ($BW = 2(\Delta f + f_m)$), Bessel functions ($J_n(m)$).
  - `EST 03-03` Phase Modulation (PM), Pre-emphasis ($75\,\mu	ext{s}$) & De-emphasis, FM stereo broadcasting.
- **Mental Anchor**: *"In AM, modulation index determines sideband power ($P_{sb} = rac{m^2}{2} P_c$); in FM, Carson's Rule gives $98\%$ power bandwidth $2(\Delta f + f_m)$."*
- **Notable Visualizers**:
  - **Time-Domain AM Envelope & Overmodulation Simulator**: Slider for $m \in [0, 2.0]$ showing clean envelope $	o$ $100\%$ modulation $	o$ envelope distortion clipping.
  - **FM Bessel Function Sideband Spectrum Visualizer**: Adjust modulation index $m_f$ to observe carrier nulls ($J_0(m) = 0$) and sideband power distribution.

---

## EST 04: Transmission Lines & Waveguides (3 Modules)
- **Key Modules**:
  - `EST 04-01` Transmission Line Primary ($R, L, G, C$) & Secondary Constants: Characteristic Impedance ($Z_0 = \sqrt{L/C}$), Velocity of Propagation ($v = c/\sqrt{arepsilon_r}$).
  - `EST 04-02` Standing Waves, Voltage Reflection Coefficient ($\Gamma = rac{Z_L - Z_0}{Z_L + Z_0}$), Standing Wave Ratio ($VSWR = rac{1 + |\Gamma|}{1 - |\Gamma|}$).
  - `EST 04-03` Quarter-Wave Transformer Matching ($Z_0' = \sqrt{Z_0 Z_L}$), Stub Matching, Rectangular Waveguides ($f_c = rac{c}{2a}$ for $TE_{10}$).
- **Mental Anchor**: *"When load matches line ($Z_L = Z_0$), $\Gamma = 0$ and $VSWR = 1.0$ (no reflected power); an open or short reflects 100% ($\Gamma = \pm 1, VSWR = \infty$)."*
- **Notable Visualizer**: **Interactive Smith Chart Impedance Matching Tool**: Draggable load impedance $Z_L$ on Smith Chart with live VSWR circle and single-stub matching line length.

---

## EST 05: Antennas & Radiation Systems (3 Modules)
- **Key Modules**:
  - `EST 05-01` Fundamental Antenna Parameters: Radiation Resistance ($R_{rad}$), Efficiency ($\eta = rac{R_{rad}}{R_{rad} + R_{loss}}$), Directivity ($D$), Gain ($G = \eta D$), Effective Aperture ($A_e = rac{\lambda^2}{4\pi} G$).
  - `EST 05-02` Dipoles & Monopoles: Half-Wave Dipole ($Z_{in} pprox 73 + j42.5\,\Omega, D = 1.64 = 2.15	ext{dBi}$), Quarter-Wave Monopole ($Z_{in} pprox 36.5\,\Omega, D = 3.28 = 5.15	ext{dBi}$).
  - `EST 05-03` Directional & Microwave Antennas: Yagi-Uda Array, Parabolic Dish ($G = \eta(rac{\pi D}{\lambda})^2$, Beamwidth $	heta pprox rac{70\lambda}{D}$), Helical, Horn Antennas.
- **Mental Anchor**: *"A half-wave dipole has $2.15	ext{dBi}$ gain; parabolic dish gain quadruples ($+6	ext{dB}$) every time diameter doubles."*
- **Notable Visualizer**: **3D Antenna Radiation Pattern Visualizer**: Switch between Isotropic sphere, Dipole donut, and Parabolic pencil beam.

---

## EST 06: Microwave Communications & Radar (3 Modules)
- **Key Modules**:
  - `EST 06-01` Microwave Link Engineering: Free Space Loss, Fade Margin, Fresnel Zone Radius ($F_1 = 17.32\sqrt{rac{d_1 d_2}{f_{	ext{GHz}} D}}$), Earth Bulge.
  - `EST 06-02` Microwave Tubes & Solid State: Klystron, Magnetron, Traveling Wave Tube (TWT), Gunn Diode, IMPATT Diode.
  - `EST 06-03` Radar Systems: Radar Range Equation ($R_{\max} = \sqrt[4]{rac{P_t G^2 \lambda^2 \sigma}{(4\pi)^3 S_{\min}}}$), Pulse Repetition Frequency (PRF), Maximum Unambiguous Range ($R_{unamb} = rac{c}{2 PRF}$), Doppler Radar.
- **Mental Anchor**: *"Fresnel zone requires at least $60\%$ clearance to avoid diffraction losses; Radar range is governed by 4th-power law ($R \propto P_t^{1/4}$)."*
- **Notable Visualizer**: **Microwave Path Profile & Fresnel Zone Obstruction Analyzer**: Add terrain obstacle to see clearance percentage.

---

## EST 07: Optical Fiber Communications (3 Modules)
- **Key Modules**:
  - `EST 07-01` Optical Fiber Physics: Core/Cladding indices ($n_1 > n_2$), Acceptance Angle ($	heta_a$), Numerical Aperture ($NA = \sin	heta_a = \sqrt{n_1^2 - n_2^2}$).
  - `EST 07-02` Fiber Types & Dispersion: Step-Index vs. Graded-Index, Single-Mode vs. Multi-Mode, Modal Dispersion, Chromatic Dispersion ($V$-number $V = rac{2\pi a}{\lambda}NA$).
  - `EST 07-03` Optical Sources, Detectors & Link Budget: Laser Diodes, LEDs, PIN Photodiodes, APD (Avalanche Photodiode), Fiber Attenuation ($	ext{dB/km}$ at $850	ext{nm}, 1310	ext{nm}, 1550	ext{nm}$).
- **Mental Anchor**: *"Total internal reflection occurs only when light travels from dense core ($n_1$) to less dense cladding ($n_2$) at an angle greater than critical angle."*
- **Notable Visualizer**: **Fiber Numerical Aperture & Light Acceptance Cone Visualizer**: Slider for $n_1$ and $n_2$ showing acceptance cone angle $	heta_a$.

---

## EST 08: Telephony & Traffic Engineering (3 Modules)
- **Key Modules**:
  - `EST 08-01` Public Switched Telephone Network (PSTN): Local loop, Hybrid 2-wire to 4-wire conversion, DTMF tones, PCM Speech ($8	ext{kHz}$ sampling $	imes 8	ext{ bits} = 64	ext{kbps}$ DS0).
  - `EST 08-02` Traffic Engineering: Erlangs ($A = rac{C 	imes H}{3600}$), Unit Call Seconds (CCS, $1	ext{ Erlang} = 36	ext{ CCS}$), Grade of Service (GoS).
  - `EST 08-03` Erlang B Formula (Blocked Calls Cleared) & Erlang C Formula (Queuing).
- **Mental Anchor**: *"1 Erlang represents 1 continuous hour of call traffic on a single circuit ($3600	ext{ call-seconds}$ or $36	ext{ CCS}$)."*
- **Notable Visualizer**: **Erlang B Traffic Capacity Calculator**: Sliders for traffic load ($A$) and available trunks ($N$) showing real-time blocking probability ($P_b$).

---

## EST 09: Digital Communications & Modulation (4 Modules)
- **Key Modules**:
  - `EST 09-01` Pulse Modulation: PAM, PWM, PPM, Pulse Code Modulation (PCM), Companding ($\mu$-law vs. $A$-law).
  - `EST 09-02` Digital Carrier Modulation: Amplitude Shift Keying (ASK), Frequency Shift Keying (FSK), Phase Shift Keying (BPSK, QPSK, 8-PSK).
  - `EST 09-03` Quadrature Amplitude Modulation (QAM): 16-QAM, 64-QAM Constellations, Bandwidth Efficiency ($R_b / B = \log_2 M	ext{ bps/Hz}$).
  - `EST 09-04` Multiplexing & Multiple Access: TDM, FDM, WDM, TDMA, FDMA, CDMA (Walsh codes, PN sequences).
- **Mental Anchor**: *"In $M$-ary modulation, each symbol transmits $n = \log_2 M$ bits; 16-QAM transmits 4 bits/symbol, quadrupling spectral efficiency."*
- **Notable Visualizer**: **Interactive Digital Constellation Explorer (BPSK, QPSK, 16-QAM)**: Add Gaussian jitter to observe noise clouds and symbol decision boundary errors.

---

## EST 10: Data Communications & Computer Networking (3 Modules)
- **Key Modules**:
  - `EST 10-01` OSI 7-Layer Reference Model & TCP/IP Protocol Suite.
  - `EST 10-02` Data Link Layer: Framing, Flow Control (Stop-and-Wait, Sliding Window), Error Detection (Parity, Checksum, CRC-16/32).
  - `EST 10-03` Network & Transport Protocols: IPv4/IPv6 Addressing, Subnetting (CIDR), Routing Protocols, TCP (reliable connection) vs. UDP (unreliable datagram).
- **Mental Anchor**: *"All People Seem To Need Data Processing (Application, Presentation, Session, Transport, Network, Data Link, Physical); IP routes packets, TCP guarantees delivery."*
- **Notable Visualizer**: **Interactive IPv4 CIDR Subnet Calculator**: Input IP and subnet mask `/24` to `/30` to see network ID, broadcast IP, usable host range, and binary bitmask.
