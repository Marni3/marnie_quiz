# Electronic Systems & Technologies (EST) — 1-to-1 Decoupled Master Learning Module Plan

## Architecture & Blueprint Overview

This document provides the exhaustive, 1-to-1 architectural master plan for all **Electronic Systems and Technologies (EST / Communications)** learning modules in the platform. Every module is grounded directly in the review center reference lecture notes (`test-sets/Reference Documents/EST/`), structured under the pedagogical guidelines defined in [`SKILL.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/.agents/skills/learning-module-authoring/SKILL.md) and [`MODULE_RESTRUCTURING_AND_PEDAGOGICAL_REFINEMENT_GUIDE.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/Reference%20Documents/MODULE_RESTRUCTURING_AND_PEDAGOGICAL_REFINEMENT_GUIDE.md).

### Decoupling & Mastery Challenge Structure
1. **Decoupled Architecture**: Learning modules are independent, deep-dive didactic instructional units (`/learn/[moduleId]`), decoupled from the 190 syllabus practice question sets in the `/quizzes` library.
2. **Module-Exclusive Mastery Challenge Sets**: Each module is paired with a dedicated, exclusive companion mastery test set accessible directly from the module view.
3. **Micro-Reinforcement Cycle**:
   $$\text{Prerequisite Bridge} \longrightarrow \text{Atomic Definitions} \longrightarrow \text{Lesson Proper Block} \longrightarrow \text{In-Line Concept Checks (5–10 MCQs)} \longrightarrow \text{Dual-Method Sample} \longrightarrow \text{Calculator Technique} \longrightarrow \text{Exclusive Mastery Challenge}$$
4. **Calculator Model Coverage**: Karce KC-S991 & Canon F-789SGA keystroke workflows (decibel conversions, logarithmic dynamic ranges, Nyquist calculations).

---

## Unit 1: Digital Modulation & Digital Radio Systems

### Module EST-01: Digital Radio, FSK, MSK & GMSK Systems
- **Source Reference**: `Notes - Digital Communications 1.pdf`
- **Prerequisite Bridge**: Connects analog carrier modulation principles to discrete digital symbol keying and modern cellular physical layers (GSM/2G/3G).
- **Atomic Definitions**:
  - **Digital Transmission vs Digital Radio**:
    - **Digital Transmission**: Transmitting digital pulses (baseband signals) directly over physical guided media (cables, twisted pairs, optical fibers).
    - **Digital Radio**: Modulating a high-frequency RF sinusoidal carrier with digital baseband signals for wireless free-space radiation.
  - **Digital Modulation Classifications**:
    - **ASK (Amplitude Shift Keying)**: Carrier amplitude varies between discrete levels; frequency and phase remain constant.
    - **FSK (Frequency Shift Keying)**: Carrier frequency shifts between discrete values; amplitude and phase remain constant.
    - **PSK (Phase Shift Keying)**: Carrier phase shifts between discrete angles; amplitude and frequency remain constant.
    - **QAM (Quadrature Amplitude Modulation)**: Hybrid scheme varying both carrier amplitude and phase.
  - **Binary Frequency Shift Keying (BFSK)**:
    - **Mark Frequency ($f_m$)**: Carrier frequency representing logic 1 (typically $f_c + \Delta f$).
    - **Space Frequency ($f_s$)**: Carrier frequency representing logic 0 (typically $f_c - \Delta f$).
    - **Peak Frequency Deviation ($\delta$)**:
      $$\delta = \frac{|f_m - f_s|}{2}$$
    - **Modulation Index ($m_f$ / $h$)**:
      $$m_f = \frac{\delta}{f_a} = \frac{|f_m - f_s|}{f_b}$$
      where $f_b$ is input bit rate ($\text{bps}$) and fundamental frequency $f_a = f_b/2$.
    - **Minimum Nyquist Bandwidth ($B_{\min}$ / $f_N$)**:
      $$f_N = 2\delta + 2f_a = |f_m - f_s| + f_b$$
  - **Continuous Phase FSK (CPFSK) / Minimum Shift Keying (MSK)**:
    - Form of FSK with modulation index $m_f = 0.5$.
    - Mark and space frequencies are synchronized to bit rate: $f_m, f_s = n\left(\frac{f_b}{2}\right)$.
    - Guarantees phase continuity at bit transitions, eliminating high-frequency spectral splatter.
  - **Gaussian Minimum Shift Keying (GMSK)**:
    - MSK modulation preceded by a Gaussian low-pass pre-modulation filter.
    - Produces a constant envelope and highly compact spectrum, standard modulation used in GSM 2G cellular mobile communications.
- **In-Line Concept Checks**: 8 MCQs on FSK deviation, mark/space frequencies, MSK modulation index ($0.5$), and GMSK in GSM cellular.
- **Sample Problems**:
  - *Problem*: A BFSK transmitter has mark frequency $104\text{ kHz}$, space frequency $96\text{ kHz}$, and input bit rate $10\text{ kbps}$. Find peak deviation, modulation index, and minimum bandwidth.
  - *Academic Derivation*: $\delta = \frac{104 - 96}{2} = 4\text{ kHz}$. $m_f = \frac{|104 - 96|}{10} = \frac{8}{10} = 0.8$. $B_{\min} = 8\text{ kHz} + 10\text{ kHz} = 18\text{ kHz}$.
  - *⚡ Board Exam Shortcut*: $\text{BW} = |f_m - f_s| + f_b = 8 + 10 = 18\text{ kHz}$.
- **Calculator Technique**: Storing bit rate and frequency deviations in variables for single-key bandwidth checks.
- **Exclusive Mastery Challenge Set**: 25 questions covering digital radio architectures, FSK parameters, CPFSK, and GMSK applications.

---

### Module EST-02: Phase Shift Keying (BPSK, QPSK, 8-PSK & 16-PSK) & Constellations
- **Source Reference**: `Notes - Digital Communications 2.pdf`
- **Prerequisite Bridge**: Extends phase modulation to multi-level symbol encoding ($M$-ary signaling) and phasor constellation mapping.
- **Atomic Definitions**:
  - **$M$-ary Signaling & Bits per Symbol ($N$)**:
    $$M = 2^N \iff N = \log_2 M$$
    - **Baud Rate ($S$)**: Symbol switching rate per second:
      $$\text{Baud Rate } S = \frac{f_b}{N} = \frac{f_b}{\log_2 M} \quad (\text{symbols/second or bauds})$$
    - **Minimum Nyquist Bandwidth ($f_N$)**:
      $$f_N = \text{Baud Rate} = \frac{f_b}{N} = \frac{f_b}{\log_2 M} \quad (\text{Hz})$$
  - **Binary Phase Shift Keying (BPSK / Phase Reversal Keying PRK)**:
    - Two phases separated by $180^\circ$ ($0^\circ$ for logic 1, $180^\circ$ for logic 0).
    - $M = 2, N = 1\text{ bit/symbol} \implies \text{Baud} = f_b$, $\text{Bandwidth} = f_b$.
  - **Quaternary Phase Shift Keying (QPSK / 4-PSK)**:
    - Four phases spaced by $90^\circ$ ($\pm 45^\circ, \pm 135^\circ$).
    - Groups of 2 bits (**dibits**): $00, 01, 10, 11$.
    - $M = 4, N = 2\text{ bits/symbol} \implies \text{Baud} = f_b/2$, $\text{Bandwidth} = f_b/2$.
    - Uses I (In-phase) and Q (Quadrature) balanced modulators.
  - **Offset QPSK (OQPSK)**:
    - Q-channel bit stream is delayed by 1 bit duration ($T_b = T_s/2$) relative to I-channel.
    - Limits maximum phase transitions to $90^\circ$, preventing zero-crossings and amplifier amplitude fluctuations.
  - **8-PSK & 16-PSK**:
    - **8-PSK**: 8 phases spaced by $45^\circ$, encoded as **tribits** ($N=3\text{ bits/symbol}$), $\text{Baud} = f_b/3$, $\text{Bandwidth} = f_b/3$.
    - **16-PSK**: 16 phases spaced by $22.5^\circ$, encoded as **quadbits** ($N=4\text{ bits/symbol}$), $\text{Baud} = f_b/4$, $\text{Bandwidth} = f_b/4$.
  - **Differential BPSK (DBPSK)**: Encodes binary data as phase transitions (e.g., $180^\circ$ shift for logic 1, $0^\circ$ shift for logic 0) rather than absolute phases, eliminating phase ambiguity at the receiver.
- **In-Line Concept Checks**: 8 MCQs on calculating baud rates from bit rates, constellation phase spacing ($360^\circ/M$), and OQPSK phase transition limits ($90^\circ$).
- **Sample Problems**:
  - *Problem*: An 8-PSK system operates at an input data rate of $60\text{ Mbps}$. Calculate the symbol rate (baud) and the minimum theoretical Nyquist bandwidth.
  - *Academic Derivation*: $N = \log_2(8) = 3\text{ bits/symbol}$. $\text{Baud Rate} = \frac{60\text{ Mbps}}{3} = 20\text{ Mbaud}$. $\text{Minimum Bandwidth} = 20\text{ MHz}$.
  - *⚡ Board Exam Shortcut*: $\text{Baud} = \text{BW} = \frac{f_b}{3} = \frac{60}{3} = 20\text{ MHz}$.
- **Calculator Technique**: Log-base-2 evaluation for $M$-ary bit sizing `log(M)/log(2)`.
- **Exclusive Mastery Challenge Set**: 25 questions testing BPSK/QPSK/8-PSK/16-PSK baud rates, constellations, and differential encoding.

---

### Module EST-03: QAM, Bandwidth Efficiency & Carrier Recovery Systems
- **Source Reference**: `Notes - Digital Communications 3.pdf`
- **Prerequisite Bridge**: High-spectral-efficiency multi-level modulation. Bridge to microwave links, satellite modems, Wi-Fi (802.11ax), and 5G QAM physical layers.
- **Atomic Definitions**:
  - **Quadrature Amplitude Modulation (QAM)**: Form of digital modulation where digital information is contained in both the amplitude and phase of the carrier:
    - **8-QAM**: $N = 3\text{ bits/symbol}$, 2 amplitudes, 4 phases. $\text{Baud} = f_b/3$, $\text{BW} = f_b/3$.
    - **16-QAM**: $N = 4\text{ bits/symbol}$, rectangular $4\times 4$ constellation with 3 distinct amplitude levels and 12 phase angles. $\text{Baud} = f_b/4$, $\text{BW} = f_b/4$.
    - Higher orders: 64-QAM ($N=6$), 256-QAM ($N=8$), 1024-QAM ($N=10$), 4096-QAM ($N=12$).
  - **Bandwidth Efficiency ($\text{BW}_{\text{eff}}$ / Spectral Efficiency)**:
    $$\text{BW Efficiency} = \frac{\text{Information Transmission Rate } (f_b)}{\text{Minimum Bandwidth } (f_N)} = \frac{f_b}{f_b/\log_2 M} = \log_2 M \quad (\text{bits/s/Hz or bits/cycle})$$
    - BPSK: $1\text{ bit/cycle}$.
    - QPSK / 4-QAM: $2\text{ bits/cycle}$.
    - 8-PSK / 8-QAM: $3\text{ bits/cycle}$.
    - 16-PSK / 16-QAM: $4\text{ bits/cycle}$.
    - 64-QAM: $6\text{ bits/cycle}$.
    - 256-QAM: $8\text{ bits/cycle}$.
  - **Carrier Recovery Techniques (Suppressed Carrier Synchronization)**:
    1. **Squaring Loop**: Passes received BPSK signal through non-linear square-law device ($\cos^2\omega_c t = \frac{1+\cos 2\omega_c t}{2}$) to extract $2\omega_c$, followed by frequency divider ($\div 2$) and PLL.
    2. **Costas Loop**: Uses two quadrature tracking loops (I and Q mixers) multiplied together to generate an error signal that drives a Voltage-Controlled Oscillator (VCO).
    3. **Remodulator**: Multiplies demodulated baseband data with received RF signal to strip data modulation.
- **In-Line Concept Checks**: 8 MCQs on QAM constellation points, computing bandwidth efficiency in bits/s/Hz, and carrier recovery loop principles.
- **Sample Problems**:
  - *Problem*: Determine the bandwidth efficiency of a 64-QAM system.
  - *⚡ Board Exam Shortcut*: $\text{BW Efficiency} = \log_2(64) = 6\text{ bits/s/Hz}$ (or bits/cycle).
- **Exclusive Mastery Challenge Set**: 25 questions testing QAM constellations, spectral efficiencies, and carrier recovery circuits.

---

## Unit 2: Pulse Modulation & Digital Baseband Transmission

### Module EST-04: Pulse Modulation Schemes & PCM System Architecture
- **Source Reference**: `Notes - Digital Communications 4.pdf`
- **Prerequisite Bridge**: Transition from analog signals to pulse streams and digital codes. Foundation of modern telephony, digital audio, and codecs.
- **Atomic Definitions**:
  - **Pulse Modulation Classifications**:
    - **Analog Pulse Modulation**:
      - **PAM (Pulse Amplitude Modulation)**: Amplitude of pulse train varies with message signal (ITU Emission Code: **K3E**).
      - **PWM / PDM / PLM (Pulse Width / Duration / Length Modulation)**: Pulse width varies with message signal (ITU: **L3E**).
      - **PPM (Pulse Position Modulation)**: Position/timing of pulse relative to clock reference varies (ITU: **M3E**).
      - **PFM (Pulse Frequency Modulation)**: Pulse repetition rate varies (ITU: **V3E**).
    - **Digital Pulse Modulation**:
      - **PCM (Pulse Code Modulation)**: Sampled amplitudes converted into discrete binary code words (ITU: **P3G**).
      - **DPCM (Differential Pulse Code Modulation)**: Transmits binary codes of the difference between successive samples.
      - **DM (Delta Modulation)**: 1-bit differential system transmitting polarity of slope changes.
  - **PCM System Functional Architecture**:
    $$\text{Analog In} \to \text{Anti-Aliasing BPF} \to \text{Sample \& Hold (S/H)} \to \text{ADC (Quantizer + Encoder)} \to \text{Channel} \to \text{DAC} \to \text{LPF} \to \text{Analog Out}$$
  - **Nyquist Sampling Theorem (Harry Nyquist 1928)**:
    To perfectly reconstruct a bandlimited analog signal of highest frequency $f_{\max}$ (or $f_a$), the sampling frequency $f_s$ must satisfy:
    $$f_s \ge 2 f_{\max}$$
    - **Nyquist Rate**: $f_{s,\min} = 2 f_{\max}$.
    - **Nyquist Interval**: $T_s = \frac{1}{2 f_{\max}}$.
    - **Aliasing / Foldover Distortion**: Occurs when $f_s < 2 f_{\max}$, causing high-frequency components to fold back into the baseband spectrum. Prevented by an anti-aliasing low-pass pre-filter.
- **In-Line Concept Checks**: 8 MCQs on pulse modulation classifications, ITU emission codes (K3E, L3E, M3E, P3G), and Nyquist sampling rate calculations.
- **Sample Problems**:
  - *Problem*: A human voice signal bandlimited to $4\text{ kHz}$ is sampled in a telephone PCM system. What is the minimum theoretical sampling rate?
  - *⚡ Board Exam Shortcut*: $f_s = 2 \times 4\text{ kHz} = 8\text{ kHz}$ ($8,000\text{ samples/sec}$).
- **Calculator Technique**: Direct calculation of Nyquist intervals and channel bit rate ($f_b = n \cdot f_s$).
- **Exclusive Mastery Challenge Set**: 25 questions testing pulse modulation types, PCM block stages, and Nyquist rate problems.

---

### Module EST-05: Quantization, Dynamic Range, Companding & Delta Modulation
- **Source Reference**: `Notes - Digital Communications 5.pdf`
- **Prerequisite Bridge**: Finite-resolution quantization noise, logarithmic companding laws, and 1-bit delta modulation tracking errors.
- **Atomic Definitions**:
  - **Quantization**: Process of rounding continuous analog sample voltages into discrete predefined voltage levels (**quantum** $q$).
    - Quantum Size / Step Size: $q = \frac{V_{\max} - V_{\min}}{2^n - 1} \approx \frac{V_{\text{p-p}}}{L}$.
    - Maximum Quantization Error: $E_{\max} = \pm \frac{q}{2}$.
  - **Dynamic Range ($\text{DR}$)**: Ratio of largest to smallest non-zero voltage level that can be quantized:
    $$\text{DR} = \frac{V_{\max}}{V_{\min}} = 2^n - 1 \implies \text{DR (dB)} = 20\log_{10}\left(\frac{V_{\max}}{V_{\min}}\right) \approx 6.02 n\text{ dB}$$
    where $n$ is number of binary bits per PCM code word.
  - **Signal-to-Quantization Noise Ratio ($\text{SQR}$ / $\text{SNR}_q$)**:
    $$\text{SQR (dB)} = 10\log_{10}\left(\frac{v^2}{q^2/12}\right) = 10.8 + 20\log_{10}\left(\frac{v}{q}\right) \approx 6.02 n + 1.76\text{ dB}$$
    - Rule of Thumb: Each additional quantization bit increases $\text{SQR}$ by $\approx 6\text{ dB}$.
  - **Coding Efficiency**:
    $$\text{Coding Efficiency} = \frac{\text{Minimum theoretical bits}}{\text{Actual bits used}} \times 100\%$$
  - **Companding (Compressing + Expanding)**:
    Non-linear processing that compresses dynamic range at the transmitter (boosting small signals) and expands it at the receiver, maintaining a uniform $\text{SQR}$ across wide volume levels.
    - **$\mu$-Law Companding** (North America & Japan, $\mu = 255$):
      $$V_{\text{out}} = \frac{\ln(1 + \mu |V_{\text{in}}|)}{\ln(1 + \mu)}$$
    - **A-Law Companding** (Europe & International ITU-T, $A = 87.6$):
      $$V_{\text{out}} = \frac{A |V_{\text{in}}|}{1 + \ln A} \quad \text{for } 0 \le |V_{\text{in}}| \le \frac{1}{A}, \quad V_{\text{out}} = \frac{1 + \ln(A |V_{\text{in}}|)}{1 + \ln A} \quad \text{for } \frac{1}{A} \le |V_{\text{in}}| \le 1$$
  - **PCM Encoding Methods**:
    - **Level-at-a-time coding**: Compares PAM sample against a linear ramp generator synchronized to a clock counter until matching.
    - **Digit-at-a-time coding**: Successive Approximation Register (SAR) coder; evaluates bits sequentially from MSB to LSB like a balance scale with binary weights.
    - **Word-at-a-time coding**: Flash encoder using $2^n - 1$ parallel comparators simultaneously (highest speed, highest complexity).
  - **Delta Modulation (DM)**:
    1-bit PCM system transmitting only $+1$ or $-1$ depending on whether the signal is increasing or decreasing.
    - **Defects of Delta Modulation**:
      1. **Slope Overload Distortion**: Occurs when input signal slope $\left|\frac{dv}{dt}\right|$ exceeds the maximum step tracking rate ($\Delta \cdot f_s$).
      2. **Granular Noise**: Small step-size hunting oscillations when the input signal is flat or slowly varying.
    - **Adaptive Delta Modulation (ADM)**: Dynamically varies the step size $\Delta$ to eliminate slope overload while minimizing granular noise.
- **In-Line Concept Checks**: 10 MCQs on PCM bit calculation from DR, $6\text{ dB/bit}$ rule, $\mu$-law vs A-law parameters, and DM slope overload causes.
- **Sample Problems**:
  - *Problem*: A PCM system requires a dynamic range of $60\text{ dB}$. Find the minimum number of bits per sample and the resulting maximum SQR for a full-scale sinusoid.
  - *Academic Derivation*: $20\log_{10}(2^n - 1) \ge 60 \implies 2^n \approx 1000 \implies n = 10\text{ bits}$. $\text{SQR} = 6.02(10) + 1.76 = 61.96\text{ dB}$.
  - *⚡ Board Exam Shortcut*: $n = \lceil 60 / 6.02 \rceil = \lceil 9.96 \rceil = 10\text{ bits}$. $\text{SQR} \approx 60 + 1.76 = 61.96\text{ dB}$.
- **Calculator Technique**: Logarithmic bit sizing `ceil(DR_dB / (20 * log(2)))`.
- **Exclusive Mastery Challenge Set**: 25 questions testing PCM quantization, dynamic range, $\mu$/A companding laws, and Delta Modulation defects.

---

## Complete EST Module Catalog

| Module Code | Topic Title | Source Note Reference | Companion Mastery Test ID |
| :--- | :--- | :--- | :--- |
| **EST-01** | Digital Radio, FSK, MSK & GMSK Systems | `Notes - Digital Communications 1.pdf` | `mastery-est-01-digital-radio-fsk` |
| **EST-02** | PSK Systems (BPSK, QPSK, 8/16-PSK) & Constellations | `Notes - Digital Communications 2.pdf` | `mastery-est-02-psk-constellations` |
| **EST-03** | QAM, Bandwidth Efficiency & Carrier Recovery | `Notes - Digital Communications 3.pdf` | `mastery-est-03-qam-carrier-recovery` |
| **EST-04** | Pulse Modulation Schemes & PCM Architecture | `Notes - Digital Communications 4.pdf` | `mastery-est-04-pulse-pcm` |
| **EST-05** | Quantization, Companding Laws & Delta Modulation | `Notes - Digital Communications 5.pdf` | `mastery-est-05-quantization-companding` |
