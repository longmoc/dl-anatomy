# Deep Learning — Ghi chú tổng hợp

> Tổng hợp các buổi trao đổi về lý thuyết deep learning, từ nền tảng toán học đến các kỹ thuật hiện đại.

---

## 1. Mối liên hệ giữa các nhánh toán học trong ML/DL

Bài toán cốt lõi: tìm $m_\theta(x)$ sao cho $m_\theta(x) \approx p_{true}(y|x)$

### Xác suất — ngôn ngữ mô hình hóa
- $p_{true}(y|x)$ là phân phối thực cần xấp xỉ
- Loss function = khoảng cách giữa hai phân phối:
  $$\mathcal{L} = D_{KL}(p_{true} \| m_\theta) = -\sum_x p_{true}(x)\log m_\theta(x) + \text{const}$$
- **Cross-entropy loss chính là KL divergence**
- MLE: $\theta^* = \arg\max_\theta \prod_i p(y_i|x_i;\theta)$

### Đại số tuyến tính — cơ sở biểu diễn
- Dữ liệu và tham số tồn tại trong không gian vector
- Mỗi layer: $z = Wx + b$ — tổ hợp tuyến tính
- Gradient là vector/tensor: $\nabla_\theta \mathcal{L} \in \mathbb{R}^{|\theta|}$
- Backprop = chain rule trên ma trận (Jacobian)

### Giải tích — cỗ máy tối ưu
- Taylor expansion: $\mathcal{L}(\theta - \eta\nabla\mathcal{L}) \approx \mathcal{L}(\theta) - \eta\|\nabla\mathcal{L}\|^2$
- Đi ngược gradient luôn giảm loss (với η đủ nhỏ)
- Chain rule → Backpropagation

### Thống kê — lý thuyết học và tổng quát hóa
- Bias-Variance Tradeoff: $\mathbb{E}[(y-\hat{f}(x))^2] = \text{Bias}^2 + \text{Variance} + \sigma^2$
- Empirical Risk Minimization
- L2 regularization ↔ MAP với prior Gaussian trên θ

---

## 2. Tại sao không cần kiểm tra tính lồi trong deep learning

### Bối cảnh cổ điển
- Hàm lồi → mọi local minimum là global minimum
- Gradient descent có đảm bảo hội tụ

### Deep learning phá vỡ điều này — nhưng vẫn hoạt động

**4 lý do chính:**

1. **Chiều cao → saddle points áp đảo** (xem mục 2.1)
2. **Mọi local minima tốt tương đương nhau** (xem mục 2.2)
3. **SGD noise là regularizer tự nhiên** (xem mục 2.3)
4. **Overparameterization tạo ra đường đi** (xem mục 2.4)

### Lý thuyết đang chạy sau thực nghiệm
- Neural Tangent Kernel (NTK): ở infinite width → lồi
- Loss landscape theory: đang nghiên cứu tích cực
- Grokking phenomenon: chưa hiểu hoàn toàn

---

## 2.1. Chiều cao → Saddle points áp đảo local minima

### Xác suất
Để là local minimum cần **tất cả** $d$ eigenvalue của Hessian dương:
$$P(\text{local min}) = 0.5^d$$

| Số chiều $d$ | $P(\text{local min})$ |
|---|---|
| 10 | ~0.1% |
| 100 | ~$10^{-30}$ |
| $10^9$ | ~$10^{-300,000,000}$ |

### Random Matrix Theory — Wigner Semicircle Law
$$\rho(\lambda) = \frac{1}{2\pi\sigma^2}\sqrt{4\sigma^2 - \lambda^2}$$

**Kết quả Dauphin et al. (2014):**
> Index của critical point (tỷ lệ eigenvalue âm) tương quan chặt với loss tại điểm đó.

### Cách gradient descent thoát saddle point
- **Exact GD:** bị kẹt tại saddle point
- **SGD noise:** $\tilde{g}_t = \nabla\mathcal{L}(\theta) + \epsilon_t$ → noise project lên hướng eigenvalue âm → thoát tự nhiên
- **Perturbed GD (Jin et al. 2017):** thêm noise có chủ đích

### Saddle point vs Plateau

| | Saddle point | Plateau |
|---|---|---|
| $\nabla\mathcal{L}$ | $= 0$ | $\approx 0$ |
| Hessian | Có eigenvalue âm | Tất cả eigenvalue ≈ 0 |
| Giải pháp | SGD noise | Momentum, Adam |

**Papers:**
- Dauphin et al. (2014): https://arxiv.org/abs/1406.2572
- Jin et al. (2017): https://arxiv.org/abs/1703.00887

---

## 2.2. Mọi local minima tốt đều tương đương nhau

### Symmetry argument
Network với 2 neuron hoán đổi được → cùng loss, khác điểm trong không gian tham số. Với L layer, n neuron: $n!^L$ điểm như vậy.

### Choromanska et al. (2015) — spin-glass model
- Loss surface ↔ Hamiltonian của spherical spin-glass model
- Với network lớn: local minima xấu giảm theo hàm mũ
- Local minima tốt tập trung ở vùng loss thấp

**Paper:** https://arxiv.org/abs/1412.0233

### Mode Connectivity — Garipov et al. (2018)
> Các điểm tối ưu được kết nối bằng đường cong đơn giản mà loss gần như không đổi.

- Linear interpolation: loss tăng ở giữa
- Bezier curve qua $\theta_{mid}$ được optimize: loss thấp suốt

**Paper:** https://arxiv.org/abs/1802.10026

### Flat vs Sharp Minima

Đo bằng Hessian: $\mathcal{L}(\theta + \epsilon) - \mathcal{L}(\theta) \approx \frac{1}{2}\epsilon^T H \epsilon$

- **Sharp minimum:** eigenvalue lớn → perturbation nhỏ → loss tăng mạnh → overfit
- **Flat minimum:** eigenvalue nhỏ → ổn định → generalize tốt

**SGD tự nhiên tìm flat minima** vì noise liên tục perturbate θ.

**Paper:** Keskar et al. (2017): https://arxiv.org/abs/1609.04836

---

## 2.3. SGD noise là regularizer tự nhiên

### Cấu trúc noise
$$\tilde{g}_t = \nabla\mathcal{L}(\theta_t) + \epsilon_t$$
$$\text{Cov}(\epsilon_t) = \frac{1}{|B|}\Sigma(\theta_t)$$

- Noise tỷ lệ nghịch với batch size: $\text{Var}(\epsilon) \propto \frac{1}{|B|}$
- Noise phụ thuộc vị trí θ (không phải noise thuần túy)

### SGD ≈ Langevin Dynamics (SDE)
$$d\theta = -\nabla\mathcal{L}(\theta)\,dt + \sqrt{\eta \cdot \Sigma(\theta)}\,dW_t$$

**Nhiệt độ hiệu dụng:**
$$T_{eff} \propto \frac{\eta}{|B|}$$

**Stationary distribution:**
$$p(\theta) \propto \exp\left(-\frac{\mathcal{L}(\theta)}{T_{eff}}\right)$$

→ SGD đang **sample từ posterior** của θ (Bayesian interpretation)

### Tại sao bias về flat minima
$$p(\text{dừng tại minimum}) \propto \frac{1}{\sqrt{\det H}}$$

Flat minimum (H nhỏ) → det H nhỏ → xác suất dừng cao hơn.

### Implicit regularizer
$$\mathbb{E}[\mathcal{L}(\theta_{t+1})] \approx \mathcal{L}(\theta_t) - \eta\|\nabla\mathcal{L}\|^2 + \underbrace{\frac{\eta^2}{2}\text{tr}(H\Sigma)}_{\text{noise penalty}}$$

Term $\frac{\eta^2}{2}\text{tr}(H\Sigma)$ phạt vùng có curvature cao tự động.

### Linear scaling rule
> Tăng batch size k lần ≡ giảm nhiệt độ k lần → cần tăng LR k lần để bù.

**Papers:**
- Smith & Le (2018): https://arxiv.org/abs/1710.06451
- Keskar et al. (2017): https://arxiv.org/abs/1609.04836

---

## 2.4. Overparameterization tạo ra "đường đi"

### Từ điểm cô lập → manifold nghiệm
Khi $|\theta| \gg n_{data}$, hệ điều kiện:
$$f_\theta(x_i) = y_i, \quad \forall i = 1..n$$

là hệ **underconstrained**: $n$ phương trình, $|\theta|$ ẩn.

$$\dim(\mathcal{M}^*) \approx |\theta| - n$$

### Null space = tự do di chuyển
Linearization: $f_\theta(x) \approx f_{\theta_0}(x) + J(\theta - \theta_0)$

Null space của Jacobian $J$: di chuyển trong $\ker(J)$ không thay đổi output, không thay đổi loss.

### Neural Tangent Kernel (NTK)
Ở infinite width: $K = JJ^T$ cố định trong suốt training.

Training dynamics: $\frac{d\mathcal{L}}{dt} = -K \cdot \mathcal{L}$ → **tuyến tính, hội tụ exponential**.

**Paper:** Jacot et al. (2018): https://arxiv.org/abs/1806.07572

### Double Descent — Belkin et al. (2019)
Phá vỡ U-curve cổ điển:

```
Error
 │
 │  \        interpolation
 │   \       threshold        \
 │    \          │        \    \___
 │     ───       │   /\    \
 │               │  /  \
 └───────────────┼──────────────── complexity
   classical     │   modern
                 │
            |θ| = n
```

Tại $|\theta| = n$: test error tăng vọt.
Khi $|\theta| \gg n$: test error **giảm trở lại**.

### Implicit bias của GD — minimum norm solution
$$\theta^* = \arg\min \|\theta\| \quad \text{s.t.} \quad f_\theta(x_i) = y_i$$

**Papers:**
- Belkin et al. (2019): https://arxiv.org/abs/1812.11118
- Soudry et al. (2018): https://arxiv.org/abs/1710.10345
- Nakkiran et al. (2019): https://arxiv.org/abs/1912.02292

---

## 3. Tại sao tabular data → shallow network tốt hơn

| Lý do | Giải thích |
|---|---|
| Không có locality | CNN/Transformer khai thác spatial/sequential structure; tabular không có |
| Features đã high-level | Không có hierarchy để học, deep chỉ thêm noise |
| n nhỏ | Overparameterization không giúp khi data ít |
| Discontinuity | Tabular có axis-aligned splits; tree-based models tốt hơn |
| Heterogeneous features | Mix continuous/categorical; deep network không có inductive bias phù hợp |
| Sensitivity với outlier | Nhiều layer khuếch đại ảnh hưởng của outlier |

**Benchmark paper:** Grinsztajn et al. (2022): https://arxiv.org/abs/2207.08815

---

## 4. Activation Functions — lịch sử và đặc điểm

### Tại sao cần activation
Không có activation: $f(x) = W_3(W_2(W_1 x)) = Wx$ — chỉ là phép biến đổi tuyến tính.

### Làn sóng 1: Probabilistic (1986–2000s)

**Sigmoid**
$$\sigma(x) = \frac{1}{1+e^{-x}} \in (0,1)$$
- Ưu: output là xác suất, smooth
- Nhược: vanishing gradient (max grad = 0.25), không zero-centered

**Tanh**
$$\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}} \in (-1,1)$$
- Ưu: zero-centered, hội tụ nhanh hơn sigmoid
- Nhược: vẫn vanishing gradient

### Làn sóng 2: ReLU family (2010–2018)

**ReLU** (Hinton et al. 2010)
$$\text{ReLU}(x) = \max(0, x)$$
- Ưu: không vanishing gradient (x>0), sparse activation, tính toán nhanh
- Nhược: dying ReLU khi x<0

**Leaky ReLU** (Maas et al. 2013)
$$f(x) = x \text{ if } x>0, \text{ else } \alpha x \; (\alpha=0.01)$$

**PReLU** (He et al. 2015): α được học từ data → vượt human-level ImageNet

**ELU** (Clevert et al. 2015): smooth tại x=0, mean activation gần 0

**SELU** (Klambauer et al. 2017): self-normalizing, không cần BatchNorm

### Làn sóng 3: Smooth & Gated (2016–nay)

**GELU** (Hendrycks 2016)
$$\text{GELU}(x) \approx x \cdot \Phi(x)$$
- Probabilistic weighting: weight input theo xác suất nó là dương
- Chuẩn cho GPT, BERT, ViT

**Swish** (Ramachandran et al. 2017, Google Brain)
$$\text{Swish}(x) = x \cdot \sigma(x)$$
- Tìm bằng Neural Architecture Search
- Dùng trong EfficientNet, MobileNet

**SwiGLU** (Shazeer 2020)
$$\text{SwiGLU}(x, W, V) = \text{Swish}(xW) \odot xV$$
- Gating mechanism: model học cách chọn feature
- Chuẩn cho LLaMA, PaLM, Mistral

---

## 5. Các khía cạnh thay đổi theo thời gian

### Optimizer

| Era | Optimizer | Điểm mới |
|---|---|---|
| 1980–2005 | SGD | Mini-batch, không momentum |
| 2006–2012 | Momentum, AdaGrad, RMSProp | Adaptive learning rate |
| 2013–2019 | Adam, AdamW | Momentum bậc 1 & 2, decoupled decay |
| 2020–nay | Muon, Lion, Schedule-free | Scale cho LLM |

### Normalization

| Era | Method | Đặc điểm |
|---|---|---|
| Trước 2015 | Không có | Careful init, weight decay |
| 2015 | BatchNorm | Normalize theo batch, cho phép LR lớn |
| 2016–2019 | LayerNorm, GroupNorm | Không phụ thuộc batch size |
| 2020–nay | RMSNorm | Bỏ mean centering, nhanh hơn |

### Initialization

| Method | Năm | Dùng cho |
|---|---|---|
| Random uniform | Trước 2010 | Thô, hay explode/vanish |
| Xavier/Glorot | 2010 | Sigmoid/Tanh |
| He initialization | 2015 | ReLU |
| Orthogonal | 2013+ | RNN, deep networks |
| muP | 2022 | Scale hyperparams theo model size |

### Architecture

| Era | Architecture | Bước nhảy |
|---|---|---|
| ~2012 | CNN (AlexNet) | Deep learning thực sự |
| 2015 | ResNet (skip connections) | 1000+ layers |
| 2017 | Transformer | Self-attention, không cần RNN/CNN |
| 2022+ | MoE, SSM (Mamba) | Scale tham số, beyond attention |

### LR Schedule

| Method | Đặc điểm |
|---|---|
| Fixed / step decay | Thô, không ổn định |
| Linear warmup + decay | Ổn định giai đoạn đầu |
| Cosine annealing | Smooth, SGDR restart |
| Cosine + warmup | Chuẩn cho LLM hiện tại |
| WSD (Warmup-Stable-Decay) | Phase stable dài → decay nhanh |

### Positional Encoding (Transformer)

| Method | Năm | Đặc điểm |
|---|---|---|
| Sinusoidal PE | 2017 | Absolute position, fixed |
| Learned PE | 2018 | Học từ data |
| Relative PE (T5, ALiBi) | 2020 | Distance-based, extrapolate tốt |
| RoPE | 2021 | Rotary embedding, LLaMA/GPT-NeoX |

### Training Paradigm

| Era | Paradigm | Đặc điểm |
|---|---|---|
| ~2012 | Supervised | Train từ đầu mỗi task |
| 2014–2018 | Transfer learning | ImageNet pretrain → finetune |
| 2018–2020 | Self-supervised | BERT, GPT, Masked LM |
| 2020–nay | RLHF / SFT / DPO | Instruction tuning, alignment |

---

## 5.1. SGD cơ bản — chi tiết

### Công thức
$$\theta_{t+1} = \theta_t - \eta \cdot \frac{1}{|B|}\sum_{i \in B} \nabla_\theta \ell_i(\theta_t)$$

### Ba chế độ

| Batch size | Noise | Đặc điểm |
|---|---|---|
| 1 (SGD thuần) | Rất lớn | Unstable, thoát local minima tốt |
| 32–256 (mini-batch) | Vừa | Điểm ngọt: balance giữa speed và stability |
| Full batch | Không có | Chính xác nhưng không scale, kẹt sharp minima |

### Điều kiện hội tụ (Robbins-Monro)
$$\sum_{t=1}^\infty \eta_t = \infty \quad \text{và} \quad \sum_{t=1}^\infty \eta_t^2 < \infty$$

### Tại sao SGD vẫn được dùng (vs Adam)
- SGD + momentum tìm **flat minima tốt hơn** vì noise isotropic
- Adam thích nghi theo từng chiều → đôi khi tìm sharp minima → generalize kém hơn trên vision tasks
- ResNet, nhiều SOTA vision model: SGD + momentum, không phải Adam

---

## Papers tham khảo tổng hợp

| Paper | Link |
|---|---|
| Choromanska et al. (2015) — Loss Surfaces | https://arxiv.org/abs/1412.0233 |
| Garipov et al. (2018) — Mode Connectivity | https://arxiv.org/abs/1802.10026 |
| Keskar et al. (2017) — Sharp/Flat Minima | https://arxiv.org/abs/1609.04836 |
| Dauphin et al. (2014) — Saddle Point Problem | https://arxiv.org/abs/1406.2572 |
| Jin et al. (2017) — Escape Saddle Points | https://arxiv.org/abs/1703.00887 |
| Smith & Le (2018) — Bayesian SGD | https://arxiv.org/abs/1710.06451 |
| Belkin et al. (2019) — Double Descent | https://arxiv.org/abs/1812.11118 |
| Jacot et al. (2018) — NTK | https://arxiv.org/abs/1806.07572 |
| Soudry et al. (2018) — Implicit Bias GD | https://arxiv.org/abs/1710.10345 |
| Nakkiran et al. (2019) — Deep Double Descent | https://arxiv.org/abs/1912.02292 |
| Grinsztajn et al. (2022) — Tree vs DL tabular | https://arxiv.org/abs/2207.08815 |
| Draxler et al. (2018) — Mode Connectivity | https://arxiv.org/abs/1803.00885 |
| Benton et al. (2021) — Loss Surface Simplexes | https://arxiv.org/abs/2102.13042 |

---

## Chủ đề chưa đi vào (gợi ý tiếp theo)

- [ ] Momentum và Nesterov accelerated gradient
- [ ] Adam / AdamW — cơ chế chi tiết
- [ ] BatchNorm vs LayerNorm vs RMSNorm
- [ ] Transformer architecture chi tiết
- [ ] Attention mechanism — scaled dot-product
- [ ] RoPE — rotary position embedding
- [ ] Neural Tangent Kernel (NTK) chi tiết
- [ ] Grokking phenomenon
- [ ] RLHF / DPO / GRPO
- [ ] MoE (Mixture of Experts)
- [ ] Scaling laws (Chinchilla)
