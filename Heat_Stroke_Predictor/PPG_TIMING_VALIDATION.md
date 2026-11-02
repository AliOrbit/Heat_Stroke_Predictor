# PPG FIFO timing correction — NOT HARDWARE VALIDATED

## Change
The PPG algorithm consumes FIFO samples. The previous code assigned the ADC sample rate without accounting for SMP_AVE decimation. max30102_init now sets sample_rate_hz to ADC rate divided by the FIFO averaging factor; the hardware register settings are unchanged. The algorithm receives this rate through the existing getter. Initialization logs both rates.

Reference: https://ez.analog.com/optical_sensing/a/documents/DO19535/if-i-enable-sample-averaging-in-max30101-max30102-and-keep-the-sampling-rate-setting-to-be-the-same-does-the-effective-sampling-rate-go-down

SMP_AVE codes 0..7 correspond to divisors 1,2,4,8,16,32,32,32. Default 100 Hz ADC /16 = 6.25 FIFO samples/sec. This corrects a source timing mismatch; it does NOT prove any particular observed pulse-rate error was caused by it, nor validate the current settings for pulse measurement.

## Required before use
- Build with the project's ESP-IDF version. A full build was not available in the editing environment.
- Read back active register settings and measure actual FIFO throughput; inspect overflow counters.
- Confirm the exact firmware on the physical unit; repository defaults are not proof of flashed settings.
- Assess waveform bandwidth at the default effective rate. A 6.25 Hz stream is limited; changing averaging or ADC rate also requires checking the 32-sample FIFO capacity and polling interval. Do not simply disable averaging while retaining a one-second poll.
- Validate beat timing, settling, signal-quality gates, contact/no-contact and motion with raw RED/IR traces and an independent reference.
- Existing filtering, peak detection, SpO2 ratio calibration, contact temperature and core-temperature estimation remain unvalidated and may still generate inaccurate values.
- No display multipliers or arbitrary offsets are introduced. No risk thresholds changed. Heat-stroke prediction is not clinically validated.

## Status
The divisor table and default rate arithmetic were checked. No ESP-IDF compile, flash or physical accuracy test has been completed. This branch has not been merged to main and does not update the user's device. Flashing requires a suitable USB data connection or an independently verified OTA path; BLE telemetry support alone is not OTA support.
