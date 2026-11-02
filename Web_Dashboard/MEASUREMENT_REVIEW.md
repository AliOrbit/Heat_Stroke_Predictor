# Measurement validation notes

The website displays device-computed telemetry without numeric calibration offsets. Internal signal-quality scores are not medical accuracy percentages.

## Source findings
- SpO2 uses the prototype mapping `110 - 25*R`. A suitable reference and repeated synchronized measurements are required to assess calibration.
- Contact temperature and model-estimated temperature are distinct. The default model applies positive ambient-difference compensation; it is not validated core temperature.
- The default MAX30102 FIFO averaging is 16, but the algorithm receives the unadjusted ADC sampling rate. Verify the actual flashed settings and FIFO output rate before changing acquisition or timing. Do not correct displayed heart rate by an arbitrary multiplier.
- The current heat-stroke risk score sums contributions from heart rate, estimated temperature and environmental heat index. SpO2 is displayed but is not a direct term in this sum. The transmitted category is debounced and can lag the raw score. A score is not a probability of illness.
- BLE processed telemetry does not include raw RED/IR waveforms. Firmware diagnostics are needed for waveform and overflow investigations.

## Validation sequence
Verify firmware version and active settings; measure FIFO throughput and overflow; inspect contact, motion, optical saturation and ambient light; compare repeated resting sessions against appropriate reference instruments; validate temperature separately; bench-test firmware before flashing. Never induce low oxygen or unsafe heat exposure for testing.

## References
https://ez.analog.com/optical_sensing/a/documents/DO19535/if-i-enable-sample-averaging-in-max30101-max30102-and-keep-the-sampling-rate-setting-to-be-the-same-does-the-effective-sampling-rate-go-down
https://ez.analog.com/optical_sensing/a/documents/c/max30102efd-t-faq/DO19495/does-the-max30102-have-an-r-curve-associated-with-it-to-correlate-the-ratio-r-acred-dcred-acir-dcir
https://www.fda.gov/consumers/consumer-updates/pulse-oximeter-basics

Website improvements do not update firmware or establish measurement accuracy. Physical validation remains outstanding.
