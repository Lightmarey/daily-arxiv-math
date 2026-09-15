# 分析与偏微分方程前沿日报 · 2026-09-14

完整收录：44 / 44。AI 协作明确披露 11 篇。

> 自动生成的阅读指南，关键结论请回查原论文。

## 当日总览

### 主要方向与技术进展

- 本期共收录 44 篇，研究重心集中在椭圆与抛物方程（14 篇）、流体方程（9 篇）、变分方法（6 篇）。
- 技术路径以$\\sigma\_k$-曲率泛函、Schouten 张量与 Gårding 锥 $\\Gamma\_k^\+$、$BV^\\mathcal A$ 的 Poincare 不等式、$BV$ 紧性和下半连续性、$C$-椭圆算子与 $BV^\\mathcal A$ 空间为主；进展形态主要是$BV^\\mathcal A$ 到 $BV$ 的端点 Korn 估计（1 篇）、磁流体方程时空导数估计（1 篇）。

### 可能的突破点

- **On the vortex filament conjecture for the Gross-Pitaevskii equation：** 核心进展是对一般光滑嵌入闭合双法向流给出 Gross--Pitaevskii 涡旋丝猜想的一种构造性实现，而不局限于圆环、螺旋或小曲率几何。论文先通过平移模态的可解性条件导出带有限部 Biot--Savart 修正的曲线演化方程，再用 Nash--Moser 理论获得全时间区间的修正曲线，借助任意代数阶的内外逼近和线性逆估计构造精确解；最终同时得到涡旋核、零集收敛、远场相位以及更高阶中心曲线误差。
- **The Cauchy problem for Manton's Chern-Simons-Schr\\"odinger equation：** 主要进展是在非线性、规范不变且拓扑非平凡的有限能量空间中完成 Manton Chern--Simons--薛定谔方程的全局适定性。证明链把协变热流提供的频率分解、抛物尺度上的高频线性化、频率包络紧性、弱距离唯一性和规范变换连续性整合起来；同时保留能量和拓扑度守恒。作为推论，在 $\|1-\\lambda\|\\ll1$ 且初始构型接近自对偶涡旋流形时得到轨道稳定性。
- **On the Large $\\Lambda$ Asymptotics of the One Phase Bernoulli Free Boundary Problem：** 核心推进是把一维剖面能量的二阶展开与移动中心 blow-up 分类结合起来。作者得到 $\\Lambda\|\\Omega\_\{u\_\\Lambda\}\|$ 和 $\\int\_D\|\\nabla u\_\\Lambda\|^2\\,dx$ 的精确首项，并在 $g&gt;0$ 时证明自由边界为 $\\partial D$ 上的解析图，其高度满足 $f\_\\Lambda\(y\)=g\(y\)\\Lambda^\{-1/2\}\+\(d-1\)H\(y\)g\(y\)^2\(2\\Lambda\)^\{-1\}\+o\(\\Lambda^\{-1\}\)$，同时给出法向、切向梯度和面积的二阶修正。

### 需谨慎处

- 《On the vortex filament conjecture for the Gross-Pitaevskii equation》：结论限定于 $\\mathbb\{R\}^3$ 中给定的光滑嵌入闭合单条度为一涡旋丝，并限于双法向流保持光滑和嵌入性的紧时间区间 $\[0,T\]$；不处理曲线交叉、奇性形成、断裂重联、多丝一般相互作用或任意初值的动力学收敛。精确解属于专门构造的有限能量解，结果不等同于所有 Gross--Pitaevskii 解的稳定性、唯一性或涡旋集中定理。证明依赖大量有限阶展开、管状坐标、平移正交条件、Nash--Moser 导数损失控制和小参数阈值，未覆盖有边界或非均匀介质的方程、其他核心度数及超出固定有限正则性指标的统一估计。
- 《The Cauchy problem for Manton's Chern-Simons-Schr\\"odinger equation》：理论针对二维全平面、均匀模型和前向时间的 DeTurck 规范；由于规范中的抛物方程，反向时间问题需要另选规范，未由本文处理。数据到解连续性主要是很弱的 Hölder 型控制，差分估计含对数损失，作者未得到 Lipschitz 流映射。轨道稳定性依赖此前关于自对偶涡旋的稳定性结果，并不等于证明 Manton 猜想所要求的模空间有效常微分方程或长期渐近动力学。部分高阶估计、规范构造和附录中的 Picard 迭代具有较强正则性与技术假设，不能直接推广到任意曲面或非均匀耦合。
- 《On the Large $\\Lambda$ Asymptotics of the One Phase Bernoulli Free Boundary Problem》：$g\\ge0$ 时只能得到自由边界和正集到 $S\_g$ 的 Hausdorff 渐近；精细图形结构、法向和二阶展开要求更强的 $g&gt;0$，因此不覆盖接触集边界 $\\partial\\\{g&gt;0\\\}$ 附近的退化行为。作者明确指出一般非负边界数据在接触区域附近仍是开放问题。假设域为有界 $C^2$ 域且边界数据为 $C^1$，结论针对 $\\Lambda\\to\+\\infty$ 的渐近过程。

## 全部论文

## 已核查未见 AI 披露

### 椭圆与抛物方程

#### On the parabolic $\\Phi\_3^4$ model for the harmonic oscillator II: global existence and invariant measures

- **作者：** Aurélien Deya、Reika Fukuizumi、Laurent Thomann
- **arXiv：** [2609\.12026](https://arxiv.org/abs/2609.12026) · [PDF](https://arxiv.org/pdf/2609.12026)
- **分类：** math\.AP、math\.PR
- **进展类型：** 全局适定性与不变测度
- **阅读优先级：** 94/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究带谐振子势 $H=-\\Delta\+\|x\|^2$ 的三维 $\\Phi^4\_3$ 随机量子化方程。作者先构造随机图并确定 Wick 重整化常数，再以抛物受控分解和固定点方法建立粗糙初值的局部适定性；随后通过大 $L^p$ 先验估计和 coming-down-from-infinity 论证得到全局解及初值一致界。由 Feller-Markov 半群和 Krylov-Bogoliubov 方法构造不变测度，用四阶累积量证明其非高斯性，最后在线性化差分、Feynman-Kac 表示和概率迭代基础上证明小耦合时唯一性与指数遍历性，并通过谐振子缩放转移到强约束势模型。

**使用技术**

- 谐振子调和 Besov 空间与热半群估计
- Wiener 混沌随机图、paracontrolled 分解与 Wick 重整化
- 大 $L^p$ Lyapunov 泛函、coming-down-from-infinity 与时间奇异积分估计
- Krylov-Bogoliubov 紧性与 Feller 半群
- 四阶累积量、Wiener chaos 乘法公式与核函数正性
- 线性化差分、Feynman-Kac 表示、局部压缩和停止时刻概率迭代
- 谐振子势缩放 $S\_\\alpha,T\_\\alpha$

**可能的突破**

在全空间 $\\mathbb\{R\}^3$ 的谐振子框架下，作者把随机图的精细正则性、调和 Besov 嵌入和大 $L^p$ 能量控制闭合为对初值一致的全局先验界，从而获得全局适定性和不变测度；四阶累积量给出任何不变测度必为非高斯，小耦合下的同步收缩则进一步给出唯一性和指数遍历性。

**限制与不确定性**

主定理前三级条目的正文证明固定 $\\lambda=1$，作者说明推广到任意 $\\lambda&gt;0$ 无额外困难；唯一性只在小耦合 $\\lambda&lt;\\lambda\_\\ast$ 下成立，不覆盖低温或相变区域。强约束势版本只针对离散集合中的 $\\alpha$，并要求 $\\alpha$ 足够大。论证依赖伴随论文的随机图输入及附录中的高阶图估计，未优化高温阈值的数值大小。

**证明逻辑/大纲**

1. **主张：** 随机图和固定重整化后的方程具有局部适定性，并且解连续依赖初值。
   - **路线：** 第 3 节定义线性解、一至五阶随机图及 $c^\{\(n\)\}=3c\_1^\{\(n\)\}-9c\_2^\{\(n\)\}$；Proposition 3\.2 和 Proposition 3\.4 分别给出随机图的收敛正则性以及时间依赖重整化常数与固定常数之间的控制。将原方程改写为更光滑余项的固定点系统后，Proposition 3\.7 的映射估计和压缩性给出局部解，Corollary 3\.10 迭代局部时间并控制近似解收敛。
2. **主张：** 建立与初值无关的 coming-down-from-infinity 先验界，并据此全球化解。
   - **路线：** Theorem 4\.4 通过热半群卷积控制余项 $v$；Theorem 4\.5 及 Lemmas 4\.6--4\.9 控制 $w$ 的时间增量。Theorem 4\.12 和 Theorem 4\.15 对 $w$ 方程用 $w^\{3p-3\}$ 测试，借助耗散项、Young 不等式和时间积分引理获得大 $L^p$ 界；Theorem 4\.19--4\.23 在更一般的调和 Besov 拓扑中闭合 $w$ 的估计，尤其得到公式 \(4\.64\)。再将 \(4\.64\) 与 \(4\.66\) 合并到 Theorem 4\.1，并用 Corollary 4\.2--4\.3 迭代局部寿命，得到全局存在、唯一性、近似解收敛和矩估计。
3. **主张：** 全局解生成 Feller-Markov 半群，并存在不变测度。
   - **路线：** 先在正则化方程层面利用独立 Brownian 增量证明 Markov 恒等式 \(5\.3\)，再用 Proposition 3\.7 的几乎处处收敛令 $n\\to\\infty$；连续依赖初值给出 Proposition 5\.2 的 Feller 性。Corollary 4\.3 的时间平均矩估计结合较弱调和 Besov 空间中的紧嵌入，使经验测度 $t^\{-1\}\\int\_0^tP\_s^\*\\delta\_u\\,ds$ 紧，从而由 Krylov-Bogoliubov 方法得到 Theorem 5\.3。
4. **主张：** 任何不变测度都不是高斯测度。
   - **路线：** 对平滑观测算子定义四阶累积量；若不变测度高斯，则公式 \(5\.4\) 中的累积量恒为零。按公式 \(3\.39\) 将解分解为高斯线性部分、三阶随机图和余项，Wiener chaos 乘法规则令高斯部分的四阶累积量约化为正核积分 $\\mathcal\{M\}\(r\)$。Lemma 5\.5 给出主项与余项的展开，Lemma 5\.6 证明 $\\mathcal\{M\}\(r\)\\ge c r^\{-1/2\}$；因此公式 \(5\.5\) 的主项在 $r\\downarrow0$ 时不能为零，和高斯假设矛盾。
5. **主张：** 小耦合下两解指数同步收缩，进而得到唯一不变测度，并可转移到强约束势模型。
   - **路线：** 第 6\.1 节按 $\\lambda$ 缩放随机图和重整化常数，借助辅助线性系统 \(6\.14\)--\(6\.17\) 将两解差异表示为线性演化。Proposition 6\.5 给出差异恒等式 \(6\.18\)，其中平方项 $S$ 非负；Proposition 6\.6 用 Feynman-Kac 表示消去该项。固定点估计 Proposition 6\.8、Corollary 6\.9 和 Corollary 6\.10 先给出单位时间内的局部收缩；Lemma 6\.13 结合 \(6\.45\)--\(6\.47\) 控制随机分割的失败概率，再由 \(6\.48\) 的概率迭代得到 Theorem 6\.1 的指数收缩和 Corollary 6\.2 的唯一性、指数遍历性。最后用 $S\_\\alpha,T\_\\alpha$ 及交织关系 \(6\.50\)--\(6\.62\) 证明 Theorem 1\.5。

**排序理由**

正文核查显示该文围绕“全局适定性与不变测度”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 94/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已检查官方 arXiv PDF 第 1--132 页，重点核查第 6 页 Acknowledgements、第 53--70 页第 6 节、第 131--132 页 References 及正文末尾，并检索全文中的 AI、LLM、ChatGPT、GPT、OpenAI、artificial intelligence、language model、software、code 和工具声明相关表述；未发现明确披露。

**原始英文摘要**

We establish an a priori bound for the dynamical parabolic $\\Phi\_3^4$ model with harmonic potential\. This bound yields the global well-posedness of the equation and, via the Krylov-Bogoliubov method, the existence of an invariant measure, shown to be non-Gaussian\. The argument builds on the strategy developed by Mourrat and Weber for the periodic $\\Phi\_3^4$ model, with substantial modifications to handle the non-compact geometry of $\\mathbb\{R\}^3$ and the spectral framework imposed by the harmonic oscillator\. We further prove that this measure is unique in the small-coupling regime\.

---

#### Perturbative Schauder Estimates for $Q$-Valued Quasilinear Elliptic Systems and a Sharp Dimension Bound for Branch Sets of Stationary Graphs

- **作者：** Mattia Luchese
- **arXiv：** [2609\.12950](https://arxiv.org/abs/2609.12950) · [PDF](https://arxiv.org/pdf/2609.12950)
- **分类：** math\.AP、math\.DG
- **进展类型：** 多值椭圆系统 Schauder 估计与分支集维数界
- **阅读优先级：** 93/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文建立接近 Laplace 系统的 $Q$-值拟线性椭圆系统的内部 Schauder 理论。作者先证明 Dirichlet-stationary 多值映射的同质性间隙与 Liouville 定理，再通过聚类 blow-up 反证得到 $C^\{1,\\alpha\}$ 和 $C^\{2,\\alpha\}$ 估计，并应用于面积驻定多值图，证明小斜率 Bernstein 定理和分支集 Hausdorff 维数上界。

**使用技术**

- 多值函数的 Sobolev 与一阶喷射理论
- 频率单调性公式
- 外变分到 Dirichlet-stationarity 的 Hodge 结构
- 同质性间隙与 Liouville blow-down
- 聚类 blow-up 与喷射分离
- 目标应力矩阵测度及孔径估计
- 缩放不变性和插值吸收
- 面积驻定图的局部正则性与分支集分层

**可能的突破**

定理 4\.5 和定理 4\.10 分别给出小主部扰动下的 $C^\{1,\\alpha\}$ 与 $C^\{2,\\alpha\}$ Schauder 估计，二维允许 $0&lt;\\alpha&lt;1/Q$，高维允许 $0&lt;\\alpha&lt;\\delta\(n,k,Q\)$ 或 $0&lt;\\alpha&lt;\\delta\(n,k\_n,Q\)$。定理 3\.12 和定理 3\.16 建立同质性 $1$ 以上的间隙，定理 3\.17 将其转化为 Liouville 定理。应用方面，定理 5\.7 证明面积驻定 $Q$-值图的分支集满足 $\\dim\_H B\_u\\leq n-2$，且该界在余维一情形已经是尖锐的。

**限制与不确定性**

Schauder 估计要求主部扰动满足小量条件并假设梯度有先验有界性，属于摄动性结果，未覆盖一般大斜率或非摄动系统。高维 Hölder 指数依赖未显式给出的同质性间隙 $\\delta\(n,k,Q\)$；二阶估计还依赖目标维数进入的间隙。分支集维数结论要求图 varifold 面积驻定，并调用外部的分支集分层理论；论文没有给出非驻定图或更一般自由边界问题的对应结论。

**证明逻辑/大纲**

1. **主张：** 第 3 节建立 Dirichlet-stationary 多值映射的频率工具、Hodge 结构和同质性间隙。
   - **路线：** 先用频率单调性控制齐次 blow-up，再通过外变分和配对 Stokes 公式证明微分仍是 Dirichlet-stationary，并得到每个分支的二阶导数对称、无迹以及孔径估计。二维情形利用角向常微分方程和单值回绕得到显式间隙；高维情形构造归一化目标应力矩阵测度，结合带孔径约束的矩阵测度单调性排除趋近于 $1$ 的非平凡齐次度。
2. **主张：** 定理 3\.17 由同质性间隙推出全局多值 Liouville 定理。
   - **路线：** 对具有全局 Hölder 控制的 Dirichlet-stationary 映射作无穷远 blow-down，频率单调性使极限具有齐次度；同质性间隙排除区间 $\(1,1\+\\alpha\]$ 内的非线性齐次极限。随后利用能量增长和次调和性证明微分全局有界，再对微分重复频率论证，得到微分恒定，因而原映射仿射。
3. **主张：** 定理 4\.5 和定理 4\.10 通过聚类 blow-up 证明一阶和二阶 Schauder 估计。
   - **路线：** 假设估计失败，按最大半范数归一化并缩放得到极限。多值分支可能以不同速率分离，因此先按一阶或二阶喷射距离聚类，保证每个极限簇保留统一的非零振荡。摄动项在缩放下消失，极限成为满足增长控制的 Dirichlet-stationary 映射；定理 3\.17 强制其仿射，或对微分强制其恒定，与归一化振荡矛盾。最后用多值插值不等式和吸收引理把简化估计恢复为完整局部估计。
4. **主张：** 第 5 节将 Schauder 理论应用于面积驻定多值图，得到 Bernstein 结论和分支集维数界。
   - **路线：** 把小斜率面积方程写成主部为 Laplace 算子的多值拟线性系统，利用面积扰动在零斜率处导数消失，将定理 4\.5 应用于缩放图，得到局部 $C^\{1,\\alpha\}$ 估计；对整个图反复缩放并令半径趋于无穷，证明微分恒定，从而映射仿射。分支集部分按重数对面积驻定 varifold 做归纳，利用局部分裂、旋转缩放闭性、弱紧性和 Schauder 正则性满足分层理论的假设，最终得到 $\\dim\_H B\_u\\leq n-2$。

**排序理由**

正文核查显示该文围绕“多值椭圆系统 Schauder 估计与分支集维数界”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 93/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 全文、摘要、正文末尾、Acknowledgements、Conflict of interest、Data availability 和 References 前后的声明区域。Acknowledgements 仅说明 EPSRC 与 Cambridge Trust 资助以及与学者的学术交流；未出现 AI、LLM 或相关工具使用声明。

**原始英文摘要**

We establish a priori interior $C^\{1,\\alpha\}$ and $C^\{2,\\alpha\}$ Schauder estimates for a class of $Q$-valued quasilinear elliptic systems which are perturbations of the Laplace system, for arbitrary multiplicity $Q$, domain dimension $n\\geq2$, and target dimension $k$\. The $C^\{1,\\alpha\}$ estimate generalises the work of Simon and Wickramasekera in \\cite\{SW16\} on $2$-valued solutions of linear systems and concerns weak solutions of divergence-form systems, while the $C^\{2,\\alpha\}$ estimate concerns strong solutions\. In dimension $n=2$, both estimates hold for every $0&lt;\\alpha&lt;1/Q$\. In dimensions $n\\geq3$, there exists $\\delta=\\delta\(n,k,Q\)&gt;0$ such that both estimates hold for every $0&lt;\\alpha&lt;\\delta$\. As applications, we obtain a small-slope Schauder estimate and a small-slope Bernstein theorem for $Q$-valued maps whose graph varifolds are stationary\. Combining the Schauder estimate with the recent branch-set stratification theory of Krummel--Minter--Wickramasekera in \\cite\{KMW26\}, we further prove that, for every $\\gamma&gt;0$, the branch set $\\mathcal B\_u$ of any $C^\{1,\\gamma\}$ $Q$-valued map $u$ whose graph varifold is stationary satisfies $\\dim\_\{\\mathcal H\}\\mathcal B\_u\\leq n-2$\. This bound is sharp already in codimension one\.

---

#### Doubling inequalities and propagation of smallness for Schr\\"odinger equations with singular potentials

- **作者：** Eugenia Malinnikova、Jiuyi Zhu
- **arXiv：** [2609\.12192](https://arxiv.org/abs/2609.12192) · [PDF](https://arxiv.org/pdf/2609.12192)
- **分类：** math\.AP
- **进展类型：** 定量唯一延拓与小量传播
- **阅读优先级：** 89/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

正文全文可得并已核查 PDF 第 1–35 页。论文对复值弱解和奇异势 $V\\in L^t$、$t&gt;d/2$ 的 Schrödinger 方程建立带显式势能依赖的全尺度 doubling 不等式，并由多尺度 Remez 迭代推出从任意正测度集合传播小量；最后应用于单连通平面 Lipschitz 域中 Dirichlet-Laplace 特征函数的 $\\log\|u\|$ 的 BMO 上界。

**使用技术**

- 齐次幂权 $L^p\\to L^q$ Carleman 不等式与势项吸收
- 对数极坐标、Laplacian 一阶因子分解和球面谱投影估计
- Caccioppoli、局部有界性、三球不等式与全尺度 doubling 迭代
- 修正 doubling index 的双重归纳与 Remez 型子立方体递推
- 共形映射、奇反射和 BMO 拟共形不变性

**可能的突破**

核心进展是把精确跟踪 Carleman 参数幂次的 $L^p\\to L^q$ 估计与多尺度 doubling-index 机制结合，在复值且仅具 $L^t$、$t&gt;d/2$ 正则性的奇异势下获得统一全尺度 doubling 和正测度集合传播小量估计；二维应用进一步把该控制转化为一般单连通 Lipschitz 域 Dirichlet 特征函数对数的 BMO 界。

**限制与不确定性**

结果限于欧氏域中的 Schrödinger 方程、$V\\in L^t$ 且 $t&gt;d/2$；二维指数需额外任意小的 $\\varepsilon$ 损失。传播结论要求解在较大球或立方体内成立、初始集合具有正测度，BMO 应用还限于单连通平面 Lipschitz 域及其共形映射的可积导数。论文不处理一般变主部算子、临界 $t=d/2$ 势或任意边界几何，也未声称所得势依赖指数在所有情形下最优。

**证明逻辑/大纲**

1. **主张：** 作者建立了具有精确 Carleman 参数幂次的齐次幂权 $L^p\\to L^q$ Carleman 不等式。
   - **路线：** 在对数极坐标 $x=e^\\ell\\omega$ 下将 Laplacian 写成 $e^\{2\\ell\}\\Delta=\\partial\_\\ell^2\+\(d-2\)\\partial\_\\ell\+\\Delta\_\\omega$，分解为交换的一阶因子 $L\_\+L\_-$；Lemma 6 给出 $L^2$ 因子估计，球面谱投影的 Lemma C 和非共振参数下的 ODE 核估计推出 Lemma 7，再分别控制低频和高频投影得到 Propositions 5、6，最后插值闭合 Theorem 3 的指数 $\\beta$。
2. **主张：** 奇异势项可被 Carleman 主项吸收，并得到三球不等式和统一全尺度 doubling 不等式。
   - **路线：** 按势的大小把 $V$ 分解为有界部分与较高可积部分，用 Hölder 和 Sobolev 估计分别控制；选择足够大的非共振 Carleman 参数吸收势项，得到 Proposition 1、2 的显式势依赖。随后以 Caccioppoli Lemma B、局部截断和 Theorem 3 推出固定比例三球不等式 Lemma 1，再沿球链传播得到 Lemma 2；在 Theorem 1 的证明中对内外环带应用相同 Carleman 界，优化参数并处理大半径情形，闭合 $\\\|u\\\|\_\{L^2\(B\_\{2r\}\)\}\\le e^\{C\(A\+N\)\}\\\|u\\\|\_\{L^2\(B\_r\)\}$。
3. **主张：** 修正 doubling index 的双重归纳给出从任意正测度集合传播小量的 Remez 型估计，进而得到 Theorem 2。
   - **路线：** 先用局部有界性和 Theorem 1 把球上的 $L^2$ 增长转成立方体 doubling index，并加入局部势项定义修正指数 $M\_u$；Lemma 3 控制子立方体指数。Proposition 3 对低值集合 $E\_a\(u\)$ 作关于 $a$ 和 $M\_u$ 的双重归纳：低指数情形由 Appendix A 的振荡 Lemma 9 给出归纳基，Lemma 5 在高指数情形选出指数至少下降一半的好子立方体，同时控制所有子立方体的函数上界，得到 $\|E\_a\(u\)\|\\le Ce^\{-\\gamma a/M\_u\(Q\)\}\|Q\|$。Corollary 2 将该尾估计转为正测度集合上的 Remez 不等式，再迭代得到 Theorem 2。
4. **主张：** 传播小量估计可转化为单连通平面 Lipschitz 域 Dirichlet-Laplace 特征函数对数的 BMO 上界。
   - **路线：** 取共形映射 $F:\\mathbb D\\to\\Omega$，令 $v\_\\lambda=u\_\\lambda\\circ F$，则共形不变性把特征函数方程变为带势 $V=\\lambda\|F'\|^2$ 的圆盘 Schrödinger 方程；利用拟共形延拓和奇反射把解、势延拓到平面，并由 $F'\\in L^\{p\_\\Omega\}$ 得到 $V\\in L^\{t\_\\Omega\}$。归一化反射解后，Proposition 3 给出 $\\log\|v\_\\lambda\|$ 的指数尾界，积分尾分布得到每个方块上的平均振荡控制，最后借助 BMO 的拟共形不变性传回 $\\Omega$，证明 Proposition 4。

**排序理由**

正文核查显示该文围绕“定量唯一延拓与小量传播”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 89/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：论文 PDF 全文逐页核查（第 1–35 页），重点包括 Section 1–5、Acknowledgment、Appendix A 和 References（PDF 第 31–35 页）。

**原始英文摘要**

We study quantitative unique continuation for solutions of the Schr\\"o\\-din\\-ger equation with complex-valued singular potentials \\\(V\\in L^t\\\), \\\(t&gt;d/2\\\)\. We obtain a family of scale-invariant \\\(L^p\\to L^q\\\) Carleman inequalities for the Laplacian and use them to prove the doubling inequalities with explicit dependence on the \\\(L^t\\\)-norm of the potential\. These estimates are combined with multiscale arguments to obtain propagation of smallness from arbitrary measurable sets of positive measure\. As an application of the main results, we prove an upper bound for the BMO norm for the logarithms of Dirichlet-Laplace eigenfunctions in simply connected planar Lipschitz domains\.

---

#### Differential Harnack inequalities and maximum principles of Morel-Oswald type for elliptic PDE in divergence form

- **作者：** Philippe Souplet、Boyan Sirakov
- **arXiv：** [2609\.12967](https://arxiv.org/abs/2609.12967) · [PDF](https://arxiv.org/pdf/2609.12967)
- **分类：** math\.AP
- **进展类型：** 定量强最大原理与微分 Harnack 不等式
- **阅读优先级：** 89/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究一般散度型一致椭圆方程正解和正超解的定量估计。作者证明带显式系数和区域尺度依赖的 Morel--Oswald 型边界增长估计，并建立齐次与非齐次方程的全局微分 Harnack 不等式，控制 $d\(x\)\|\\nabla u\(x\)\|/u\(x\)$。

**使用技术**

- 局部归一化与边界扁平化
- 小系数 Morel--Oswald 引理
- 受控半径球覆盖与 Harnack 链
- 对数变换 $v=\\log u$
- doubling lemma 与反证缩放
- 标准梯度估计和 Harnack 不等式
- 对偶算子与障碍函数
- 径向构造验证常数尖锐性

**可能的突破**

定理 2\.1 给出一般 $C^\{1,\\bar\\alpha\}$ 有界区域和散度型算子的统一结果：正超解满足 $u\(x\)/d\(x\)$ 的显式 Morel--Oswald 下界；齐次方程满足 $d\(x\)\|\\nabla u\(x\)\|/u\(x\)$ 的全局微分 Harnack 估计；非齐次方程在 $f\\geq0$ 时增加一个含 $\\\|f\\\|\_\{L^q\}$ 与加权 $L^1\_d$ 范数的定量项。定理 2\.2 同时给出全局边界 Harnack 不等式。结果允许一阶漂移和势项仅具有 $L^q$ 正则性，并明确展示了系数规模与区域几何的依赖。

**限制与不确定性**

主要结果要求 $q&gt;n$、主系数 Hölder 连续且区域边界为 $C^\{1,\\bar\\alpha\}$；作者只讨论了向 Dini 正则性的可能推广，未写出相应显式常数。非齐次微分 Harnack 中加权 $L^1\_d$ 分母在高维的最优性仍未完全确定，右侧第二项前的指数常数是否尖锐也未解决。若右端项不满足非负性，梯度比值可失控；当主系数或边界仅连续而非 Hölder 时，Morel--Oswald 估计可能失败。

**证明逻辑/大纲**

1. **主张：** 定理 2\.1\(i\) 的 Morel--Oswald 估计由局部小系数引理和有限覆盖拼接得到。
   - **路线：** 引理 4\.1 在归一化内球或半球型区域中构造辅助 Dirichlet 解，借助对偶算子、全局弱 Harnack 不等式和最大值原理证明 $v/d$ 控制源项的加权积分。引理 4\.2 通过半径 $r=\\delta r\_0$ 的缩放把原算子变成小系数形式。再用命题 8\.2 选取数量受控、每个球承载固定体积的内外球覆盖，从所有局部估计中选取一个承载足够 $\\int f d$ 的球，并与全局 Harnack 下界合并，得到全局指数常数。
2. **主张：** 定理 2\.1\(ii\)--\(iii\) 的微分 Harnack 估计通过局部缩放与对数变换的 doubling 反证闭合。
   - **路线：** 先以 $v=\\log u$ 将方程改写为含二次梯度项的方程（5\.2），并假设归一化梯度比值在某点发散。doubling lemma 选出局部近最大点 $x\_k$，以 $\\rho\_k=\|\\nabla v\_k\(x\_k\)\|^\{-1\}$ 缩放，使梯度在每个固定球内有界且原点梯度归一化为 $1$。系数和非齐次源项在缩放下消失，极限满足常系数方程；当 $n\\geq2$ 时指数变换得到全空间正调和函数，强制为常数；当 $n=1$ 时得到 $e^w$ 的分布意义凹性，同样与非零梯度矛盾。非齐次估计先用局部 $C^1$ 估计，再用 Morel--Oswald 下界控制 $u$ 的分母。
3. **主张：** 定理 2\.2 的全局 Harnack 估计由边界和内部局部 Harnack 不等式沿受控 Harnack 链迭代得到。
   - **路线：** 利用区域的 $C^\{1,\\bar\\alpha\}$ 几何，在边界点作坐标扁平化，在内部点作半径归一化，得到统一局部弱 Harnack 估计。命题 8\.2 控制连接任意两覆盖球所需的链长度，沿链迭代局部估计并对覆盖球求和，得到带 geodesic diameter 和系数规模显式依赖的积分 Harnack 不等式；对满足零边界条件的解，再结合边界增长估计得到全局上界。
4. **主张：** 命题 1\.2、命题 2\.3 及第 6--7 节证明主要常数和若干范数依赖的尖锐性或失败性。
   - **路线：** 通过缩放保持估计形式不变，再在单位球中构造径向函数 $u=e^\{\\lambda\\phi\}-1\+K\\phi$，选择势项或漂移项与 $\\lambda$ 匹配，比较边界法向导数和加权源项积分，得到指数系数不能改善。第 7 节进一步构造集中源项，说明某些更强的 $L^p\_d$ 替换会破坏非齐次梯度估计；第 6 节展示边界或主系数仅连续时 Hopf--Oleinik 型结论可能失效。

**排序理由**

正文核查显示该文围绕“定量强最大原理与微分 Harnack 不等式”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 89/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 摘要、正文全部章节、Acknowledgements、Conflict of interest、Data availability、References 前后的文末区域以及全文相关关键词。正文未设置 AI 使用声明；文末仅有参考文献与常规数学致谢或声明内容，未披露 AI、LLM 或相关工具用途。

**原始英文摘要**

This paper presents two types of novel, qualitative and quantitative, estimates for positive solutions of general uniformly elliptic PDEs in divergence form\. First, we prove a Morel-Oswald type of extension of the Hopf-Oleinik lemma, in which in addition we specify the sharp dependence of the constant in the data of the operator and the size of the domain\. Second, we establish a new differential Harnack \(logarithmic gradient\) estimate for non-homogeneous equations, as well as an optimal global differential Harnack estimate for homogeneous equations\.

---

#### Fractional very fast diffusion equations in Lebesgue spaces: uniqueness and smoothing effects

- **作者：** Mohammed-El-Mahdi Boudaoud、Arturo de Pablo、Fernando Quirós
- **arXiv：** [2609\.12703](https://arxiv.org/abs/2609.12703) · [PDF](https://arxiv.org/pdf/2609.12703)
- **分类：** math\.AP
- **进展类型：** 唯一性与平滑效应
- **阅读优先级：** 88/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究分数阶极快扩散方程 $\\partial\_tu\+\(-\\Delta\)^\{\\sigma/2\}u^m=0$ 在 $m\\in\(0,m\_c\]$ 中的唯一性与平滑效应，其中 $m\_c=\(N-\\sigma\)/N$、$p\_\*=N/\[\\sigma\(1-m\)\]$。作者建立加权很弱解的唯一性和比较原理，进而得到 $L^p$ 与 Marcinkiewicz 空间 $M\_p$ 中的适定性、前向和后向平滑、临界有限时间消灭，并构造所有失效区间的反例。

**使用技术**

- 用加权很弱解、权函数 $v\\in\\Theta$ 及加权收缩估计处理无穷空间上的低可积性初值。
- 对两个解作差，定义时间积分 $w=\\int\_0^t\|u^m-\\widehat u^m\|\\,ds$，结合 Kato 不等式、分数阶次调和函数刻画和 Silvestre 估计证明唯一性。
- 利用球对称递减重排、质量集中序关系和最集中幂函数初值，建立对一般 $M\_p$ 数据有效的浓度比较。
- 借助自相似解、分数阶齐次性、Riesz 势估计和 $M\_p$ 范数控制，推导前向 $M\_p\\text\{--\}L^\\infty$ 与后向 $M\_p\\text\{--\}L^1$ 平滑阈值。
- 用临界显式消灭解、自相似幂函数和缩放紧支撑脉冲构造平滑效应失效反例，并在附录以截断尾部估计证明 $p&gt;p\_\*$ 时的 $L^p$ 时间连续性。

**可能的突破**

核心贡献是在极快区间 $m\\le m\_c$ 将加权很弱解的唯一性从已知范围推进到完整的 $m\\in\(0,1\)$，从而排除大解分支并把已有最小解平滑结果提升为所有解的结论。论文给出由临界指数 $p\_\*$ 分隔的完整图景：$p&gt;p\_\*$ 时有前向 $M\_p\\text\{--\}L^\\infty$ 平滑，$1&lt;p&lt;p\_\*$ 时有后向 $M\_p\\text\{--\}L^1$ 平滑，$M\_\{p\_\*\}$ 是有限时间消灭类，而其余前向或后向区间均有明确反例。

**限制与不确定性**

结论限于非负解、分数阶阶数 $\\sigma\\in\(0,2\)$ 且 $N&gt;\\sigma$ 的全空间问题，并依赖加权很弱解框架。临界指数 $p=p\_\*$ 下从 $L^\{p\_\*\}$ 初值出发的前向和后向平滑仍未解决；$L^p$ 在 $p\\le p\_\*$ 时以及 $M\_p$ 在一般 $p$ 下的时间连续性也保持开放。部分反例只属于很弱解而非弱能量解，不能直接转化为更强能量解类别中的失效结论。

**证明逻辑/大纲**

1. **主张：** 通过分数阶次调和性建立加权很弱解的唯一性。
   - **路线：** 对两个同初值解相减并乘以 $\\operatorname\{sign\}\(u-\\widehat u\)$，先在光滑情形用 Kato 不等式得到 $\\partial\_t\|u-\\widehat u\|\\le-\(-\\Delta\)^\{\\sigma/2\}\|u^m-\\widehat u^m\|$。对一般加权解以光滑近似和截断测试函数传递该不等式，令 $w\(x,t\)=\\int\_0^t\|u^m-\\widehat u^m\|\(x,s\)\\,ds$，证明 $w$ 在很弱意义下为 $\\sigma/2$-次调和。再用 Silvestre 的平均值估计和权函数尾部衰减令半径 $R\\to\\infty$，得到 $w=0$，从而 $u=\\widehat u$。
2. **主张：** 唯一性与比较原理结合已有加权存在性，闭合 $L^p$ 和 $M\_p$ 解的适定性。
   - **路线：** 先将 $L^p$ 或 $M\_p$ 初值嵌入某个可容许加权空间 $L^1\_v$，由加权很弱解存在性和 Theorem 3\.3 的唯一性得到唯一解。对 $L^p$ 数据用近似弱解及 $L^p$ 范数收缩证明范数随时间不增；对 $M\_p$ 数据以最集中幂函数 $U\_0\(x\)=A\|x\|^\{-N/p\}$ 作浓度比较，利用重排保持和质量集中序将其范数控制传递给一般数据。
3. **主张：** 自相似最坏情形解给出前向平滑、有限时间消灭和临界阈值。
   - **路线：** 对幂函数初值利用方程缩放和唯一性得到自相似表示；临界 $p=p\_\*$ 时改用分离变量构造显式有限时间消灭解。对 $p&lt;p\_\*$，由比较原理和 Theorem 4\.3 的 Riesz 势尾部估计控制空间无穷远；对 $p&gt;p\_\*$，自相似轮廓在正时间变得有界。将这些最集中解与一般 $M\_p$ 数据作浓度比较，得到 $p&gt;p\_\*$ 时 $M\_p\\text\{--\}L^\\infty$ 平滑，并由临界显式解推出 $M\_\{p\_\*\}$ 的有限时间消灭。
4. **主张：** 在 $1&lt;p&lt;p\_\*$ 时通过迭代 Marcinkiewicz 指数得到后向 $M\_p\\text\{--\}L^1$ 平滑。
   - **路线：** 先对最集中自相似解使用 Theorem 4\.3 的点态衰减。令 $p\_m=N/\(mN\+\\sigma\)$：当 $p&lt;p\_m$ 时尾部直接可积，当 $p=p\_m$ 时先得到任意较高指数的局部 $M\_q$ 控制。对 $p\\in\(p\_m,p\_\*\)$，定义递推 $q\_\{k\+1\}=mNq\_k/\(N\+\\sigma q\_k\)$；由点态估计证明 $M\_p$ 解进入 $M\_\{q\_k\}$，有限次迭代降至 $M\_\{p\_m\}$，再用临界步骤获得 $L^1$。浓度比较把该结论推广到任意 $M\_p$ 初值。
5. **主张：** 通过自相似平移解和缩放脉冲构造所有失效平滑区间的反例。
   - **路线：** 当 $p&lt;p\_\*$ 时取指数 $r\\in\(p,\\min\\\{p\_\*,q\\\}\)$ 的自相似解，其正时间原点奇性保持为 $\|x\|^\{-N/r\}$，所以不属于目标 $M\_q$ 或 $L^\\infty$，但由后向平滑的时间平移可使初值进入 $L^p$。当 $p&gt;p\_\*$ 时在无穷远使用相同构造，反向得到后向平滑失效。临界 $m=m\_c$ 时将紧支撑脉冲按尺度缩放并叠加，使初值仍在 $L^1$ 而任意正时刻的 $L^\\infty$ 范数无界。

**排序理由**

正文核查显示该文围绕“唯一性与平滑效应”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 88/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--22 页全文，包括引言、Sections 2--6、Appendix A、Acknowledgements、References 及正文末尾；未发现作者明确披露 AI、LLM、软件或工具用于研究、证明、写作、代码、编辑、校对、翻译、排版、图表或插图。Acknowledgements（PDF 第 21 页）仅说明资助来源并感谢 Jorge Ruiz-Cases 的学术讨论。

**原始英文摘要**

We investigate forward and backward smoothing effects in Lebesgue spaces $L^p$ and $\\mathcal\{M\}^p:=L^\{p,\\infty\}$ for the Cauchy problem associated to the nonlinear and nonlocal fractional diffusion equation $\\partial\_t u\+\(-\\Delta\)^\{\\frac\\sigma2\}\|u\|^\{m-1\}u=0$ in $\\mathbb\{R\}^N$, $0&lt;\\sigma&lt;2$, in the very fast range $0&lt;m\\le m\_c:=\\frac\{N-\\sigma\}\{N\}$\. We prove that very weak solutions have an $\\mathcal\{M\}^p$--$L^\\infty$ smoothing effect if $p&gt;p^\*:=\\frac\{N\}\{\\sigma\}\(1-m\)$, and we construct counterexamples showing the failure of any $L^p$--$\\mathcal\{M\}^q$ forward \($q&gt;p$\) smoothing effect if $1&lt; p&lt; p^\*$, $m&lt;m\_c$ or $L^1$--$\\mathcal\{M\}^q$ \($q&gt;1$\) if $m=m\_c$\. We also prove a backward $\\mathcal\{M\}^p$--$L^1$ smoothing effect whenever $1\\le p&lt;p^\*$, $m&lt;m\_c$, and we construct counterexamples showing that there is no $L^p$--$\\mathcal\{M\}^q$ backward \($q&lt;p$\) smoothing effect if $p&gt; p^\*$\. Regarding the threshold value $p=p^\*$, we prove that all solutions starting in $\\mathcal\{M\}^\{p^\*\}$ become extinct in finite time, and show the failure of any $\\mathcal\{M\}^\{p^\*\}$--$\\mathcal\{M\}^q$ smoothing before extinction for any $q\\neq p^\*$\. The construction of counterexamples is based on new uniqueness and comparison results for very weak solutions, combined with the existence of self-similar solutions with suitable properties\. The same approach yields new counterexamples for both forward and backward smoothing effects also in the local case $\\sigma=2$\.

---

#### Classification of solutions to the Liouville equation with a nonlinear Robin boundary condition on the unit disk

- **作者：** Jingbo Dou、Yunyun Hu、Keqing Peng
- **arXiv：** [2609\.12847](https://arxiv.org/abs/2609.12847) · [PDF](https://arxiv.org/pdf/2609.12847)
- **分类：** math\.AP
- **进展类型：** 复分析刚性与解分类
- **阅读优先级：** 86/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究单位圆盘上的 Liouville 方程 $-\\Delta u=e^\{2u\}$ 及非线性 Robin 边界条件 $\\partial\_\\nu u\+\\lambda=e^u$。作者构造归一化全纯提升，将方程转化为 Hardy 空间中的矩阵与系数问题；在 $\\lambda\\le2$ 且 $\\lambda\\ne1$ 时证明解必为唯一径向显式解，在 $\\lambda=1$ 时给出由圆盘自同构生成的完整分类，并在 $2&lt;\\lambda\\le3$ 时证明径向解与具有二阶投影障碍的非径向解二分。

**使用技术**

- 把 $p=e^\{-u\}$ 与 Schwarzian 型全纯系数联系起来，构造满足 $\\det\(Y',Y\)=1$ 和 $p=\|Y\|^2/2$ 的归一化全纯提升 $Y$。
- 将提升分解为标量外因子 $g$ 与边界模长为一的内因子 $X$，使用 Hardy 空间等距乘子、Beurling--Lax 型因子化和 Taylor 系数谱主化。
- 通过边界 Fourier 恒等式、第一与第二矩恒等式及 Parseval 等式控制低阶和高阶模态，建立全纯刚性。
- 在 $\\lambda=1$ 时把射影微分消去，构造球面值 Möbius developing map，并利用球面圆盘的测地曲率确定像域半径。
- 在 $\\lambda&gt;2$ 时以第二矩估计控制三阶以上模态，将外因子系数障碍转化为 $q\(0\)=u\_z\(0\)^2-u\_\{zz\}\(0\)\\ne0$，再用径向对称性和二次方程分类径向解。

**可能的突破**

核心贡献是提出 Hardy--Wronskian 方法，绕开移动平面、变分法和标准 blow-up 工具，对含内部 Liouville 指数项和非线性 Robin 边界项的单位圆盘问题建立新的刚性机制。该方法在非共形范围 $\\lambda\\le2$ 给出完整分类，在共形值 $\\lambda=1$ 给出所有解的圆盘自同构表示，并在 $2&lt;\\lambda\\le3$ 提取非径向解必有的二阶投影障碍。

**限制与不确定性**

解分类建立在 $u\\in C^\\infty\(D\)$ 和单位圆盘几何上。$\\lambda&gt;2$ 时论文只在 $2&lt;\\lambda\\le3$ 给出径向或非径向二分及非径向障碍，并未分类所有非径向解；当 $\\lambda&gt;3$ 没有相应完整结论。临界值 $\\lambda=1$ 的表示依赖 Möbius 共形不变性，不能直接用于 $\\lambda\\ne1$；径向分类不等于一般解的存在性分类。

**证明逻辑/大纲**

1. **主张：** Liouville 方程及 Robin 边界条件等价于归一化全纯提升的 Wronskian 系统。
   - **路线：** 令 $p=e^\{-u\}$ 和 $\\varphi=u\_\{zz\}-u\_z^2$，由内部方程得到 $pp\_\{z\\bar z\}-p\_zp\_\{\\bar z\}=1/4$ 及 $p\_\{zz\}\+\\varphi p=0$，并证明 $\\varphi$ 全纯。为线性方程 $y''\+\\varphi y=0$ 取归一化基本解，利用正定 Hermitian 矩阵平方根构造 $Y$，得到 $\\det\(Y',Y\)=1$、$p=\|Y\|^2/2$；反向使用 Gram 恒等式恢复 $-\\Delta u=e^\{2u\}$ 和边界条件。
2. **主张：** 外因子分解与 Hardy 谱主化把边界条件转化为全纯刚性，迫使 $0&lt;\\lambda\\le2$ 时提升为仿射函数。
   - **路线：** 在边界设 $F=\|Y\|^2$，由 Robin 条件得到 $\\operatorname\{Im\}\\Phi=\(1-\\lambda\)\\dot F/\(2F\)$。对 $F$ 构造唯一无零标量外因子 $g=e^h$，比较虚部得到 $\\Phi=\(\\lambda-1\)Dh$，并推出非平凡外因子的首个系数消失。写成 $Y=gX$ 后，$X$ 在边界为单位模，乘法算子保持 Hardy 范数；Lemma 2\.9 的加权 Taylor 系数不等式与 Proposition 2\.10 的一、二阶矩恒等式合并，在 $a=\\lambda-1\\le1$ 时迫使 $g$ 为常数，从而由 $D\(D-1\)Y=\\Phi Y$ 得 $Y=A\_0\+A\_1z$。
3. **主张：** 非共形范围的解必为径向显式解，共形值的全部解由圆盘自同构生成。
   - **路线：** 对 $\\lambda\\le0$，积分内部方程并代入边界条件得到正量等于非正量的矛盾。对 $0&lt;\\lambda\\le2$ 且 $\\lambda\\ne1$，仿射提升的 Fourier 首模比较给出 $\\langle A\_1,A\_0\\rangle=0$；Wronskian 归一化后 $\|A\_1\|^2=R$、$\|A\_0\|^2=R^\{-1\}$，遂得到 $u=\\log\(2R/\(1\+R^2\|z\|^2\)\)$ 及 $\(\\lambda-2\)R^2-2R\+\\lambda=0$。当 $\\lambda=1$，先由同一仿射提升构造全局 Möbius developing map，再把圆盘等距映到球面半径满足 $\\cot\\rho=1$ 的圆盘，故 $\\rho=\\pi/4$、$R=\\sqrt2-1$；球面等距变换和边界保持性给出 $u=\\log\(2R\|\\psi'\|/\(1\+R^2\|\\psi\|^2\)\)$，并证明 $\\psi$ 仅在旋转因子下唯一。
4. **主张：** 在 $2&lt;\\lambda\\le3$ 时，非径向性必产生二次投影障碍，而所有径向解由同一正根方程决定。
   - **路线：** 令 $a=\\lambda-1\\in\(1,2\]$。第二矩谱估计给出三阶以上外因子系数的加权控制；若外因子非恒定，则证明其二次系数 $b\_2\\ne0$，并由 $q\(0\)=2ab\_2/b\_0$ 得 $q\(0\)=u\_z\(0\)^2-u\_\{zz\}\(0\)\\ne0$。若解径向，则旋转协变性迫使全纯投影系数 $q$ 恒为零，于是 $p=e^\{-u\}$ 为 $\\alpha\+\\beta\|z\|^2$，内部 Wronskian 条件给出 $\\alpha\\beta=1/4$，边界条件再次化为 $\(\\lambda-2\)R^2-2R\+\\lambda=0$。判别式 $4\[1\+2\\lambda-\\lambda^2\]$ 决定各参数区间的径向解个数及 $\\lambda&gt;1\+\\sqrt2$ 时的径向不可存在性。

**排序理由**

正文核查显示该文围绕“复分析刚性与解分类”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 86/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--31 页全文，包括引言、Sections 2--4 的全部定理与证明、Acknowledgements、References 及正文末尾；未发现作者明确披露 AI、LLM、软件或工具用于研究、证明、写作、代码、编辑、校对、翻译、排版、图表或插图。Acknowledgements（PDF 第 29 页）仅列出国家自然科学基金、陕西高校青年创新团队及中央高校基本科研业务费资助。

**原始英文摘要**

In this paper, we study the nonlinear boundary value problem \\begin\{equation\*\} \\begin\{cases\} -\\Delta u=e^\{2u\},& \\mbox\{in \} \{\\mathbb\{D\}\},\\\\ \\frac\{\\partial u\}\{\\partial\\nu\}\+\\lambda=e^u ,& \\mbox\{on \} \{\\mathbb\{S\}^\{1\}\}, \\end\{cases\} \\end\{equation\*\} where $\\mathbb D$ is the unit disk, $\\lambda$ is a constant and $\\nu$ denotes the outer unit normal on $\\mathbb S^1$\. For $0&lt;\\lambda\\le2$, we establish a complete classification of smooth solutions\. For $2&lt;\\lambda\\leq3$, we prove a dichotomy between radial solutions and nonradial solutions\. We develop a Hardy-Wronskian boundary rigidity method that transforms the nonlinear boundary value problem into a spectral rigidity problem for normalized holomorphic frames\. This method exploits the complex-analytic structure of the Liouville equation with a Robin boundary condition and provides a new rigidity framework for related two-dimensional elliptic boundary value problems\.

---

#### Multi-Spectral QPAT with Frequency Averaged Measurements

- **作者：** Yunhao Sun、Yang Yang、Yunan Yang
- **arXiv：** [2609\.12232](https://arxiv.org/abs/2609.12232) · [PDF](https://arxiv.org/pdf/2609.12232)
- **分类：** math\.AP
- **进展类型：** 频率平均QPAT逆稳定性
- **阅读优先级：** 82/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--36 页。论文建立频率平均 QPAT 模型，将扩散系数与吸收系数限制为有限个已知频率函数的空间系数组合；先证明前向解与测量映射的 Fréchet 线性化，再用 $2n\(I\+J\)$ 组 CGO 型宽带测量得到线性化双 Lipschitz 稳定性，最后通过抽象 Banach 空间定理推出局部非线性 Hölder 稳定性。

**使用技术**

- 频率参数有限谱分解与 Bochner 平均测量
- 椭圆边值问题的解算子表示、Neumann 展开与 Fréchet 线性化
- CGO 解构造、向量场矩阵可逆性与线性化核消除
- 频率局部化近似恒等元与多频测量拼接
- Banach 空间插值与非线性逆函数稳定性

**可能的突破**

核心进展是把频率独立 QPAT 的 CGO 线性稳定性推广到有限谱频率平均测量：先在若干选定频率用左逆恢复各空间系数，再用周期化热核近似恒等元构造宽带边界数据，使平均测量逼近点频测量并吸收误差，从而获得 $2n\(I\+J\)$ 组测量的线性双 Lipschitz 估计；结合二阶余项和插值估计，进一步得到局部非线性 Hölder 逆稳定性。

**限制与不确定性**

结果依赖有界光滑区域、空间维数 $n\\ge 3$、系数的统一正性与有界性、有限频率函数的线性独立性，以及扰动支撑满足 $\\Omega'\\Subset\\Omega$ 等条件。非线性结论仅为局部结论，未建立全局唯一性或全局稳定性；未覆盖无限秩或任意不具有限独立谱结构的频率依赖、粗糙区域、一般低正则系数，也未证明 $2n\(I\+J\)$ 是最优测量数量。

**证明逻辑/大纲**

1. **主张：** 前向问题适定，且参数到测量映射具有可控的一阶导数与二阶余项。
   - **路线：** 用调和延拓与齐次逆算子表示 $u\_t=T f\_t-G\_t L\_t T f\_t$；由算子连续性控制频率变化，再以 Neumann 级数展开得到线性化项和二次余项，随后用椭圆正则性提升导数映射的 Sobolev 有界性与连续性。
2. **主张：** 频率独立模型的线性化测量算子核为零，并具有 Lipschitz 稳定性。
   - **路线：** 取由 CGO 解给出的 $2n$ 个实解，构造向量场 $\\beta^k$ 并利用其矩阵可逆性；将零测量条件改写为系统 \(4\.3\)，通过 $\\beta$ 的逆矩阵消去梯度耦合项，再结合扰动紧支撑、系数关系和唯一延拓排除所有非零扰动；半 Fredholm 估计因此升级为稳定估计。
3. **主张：** 有限谱频率的平均测量继承点频线性稳定性，闭合 Theorem 2\.1。
   - **路线：** 在选定的 $I\+J$ 个频率上对有限谱系数矩阵取左逆 $P^\\dagger$ 与 $Q^\\dagger$，先由点频估计控制系数；再用周期化热核近似恒等元 $\\eta\_\\varepsilon$ 局部化边界数据，利用频率连续性的模估计证明平均重加权测量与点频测量之差为 $o\(1\)$，最后选取足够小的 $\\varepsilon$ 吸收误差。
4. **主张：** 线性化稳定性、导数正则性和二阶余项共同推出局部非线性 Hölder 稳定性。
   - **路线：** 按 Proposition 5\.1 设置 $X''=W^\{s\+2,\\infty\}$、$X'=L^2\\oplus H\_0^1$、$X=L^\\infty\\cap X'$ 及相应测量空间；用 Lemma 3\.7 验证导数高阶有界性，用 Lemma 3\.2 验证二次余项，用 Theorem 2\.1 验证逆导数估计，再选 $s$ 使插值指数满足 $\\alpha=\\mu\_1\\mu\_2&gt;1/2$，应用抽象定理闭合局部 Hölder 估计。

**排序理由**

正文核查显示该文围绕“频率平均QPAT逆稳定性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 82/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：论文 PDF 全文逐页核查（第 1--36 页），覆盖正文各节、Acknowledgments、Appendix A 与 References；同时对全文执行 AI/LLM 相关关键词检索。

**原始英文摘要**

We study some inverse problems in a frequency-averaged model for quantitative photoacoustic tomography, in which the optical parameters are modeled by a finite number of spectral functions and spatial coefficients, and the measurements are given by internal observables averaged over a spectral bandwidth\. Using multiple measurements generated by suitable complex geometrical optics solutions, we establish uniqueness and Lipschitz-type stability for the associated linearized inverse problem for diffusion and absorption recovery\. This linearized stability further yields local H\\"older-type stability for the nonlinear inverse problem via an abstract linear-to-nonlinear argument\.

---

#### Large-Time Behavior of Pseudo-Parabolic Equations Associated with Generalized Total Variation Energies

- **作者：** Daisuke Kubota、Daiki Mizuno、Ken Shirakawa、Naotaka Ukai
- **arXiv：** [2609\.12583](https://arxiv.org/abs/2609.12583) · [PDF](https://arxiv.org/pdf/2609.12583)
- **分类：** math\.AP
- **进展类型：** 存在性与长时间渐近
- **阅读优先级：** 82/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文在 $BV$ 框架下研究带广义全变分能量的伪抛物方程。作者先对时间和空间依赖系数建立全局存在唯一性，再分析解的 $\\omega$-极限集：基本假设下至少一个极限点满足稳态变分不等式，$\\beta$ 指数衰减时所有极限点满足该不等式；在势函数严格凸及额外衰减条件下，稳态解唯一且整个轨道在 $H$ 中收敛到该稳态。

**使用技术**

- 用广义全变分泛函、$BV$ 弱紧性和下半连续性处理稳态解可能具有跳跃的线性增长能量。
- 通过隐式时间离散方案 $\(AP\)\_\\tau^\\varepsilon$ 将每个时间层化为严格凸泛函 $\\Upsilon^\\varepsilon$ 的极小化问题，并以离散能量估计控制时间增量。
- 结合比较原理、Aubin 型紧性、Banach--Alaoglu 定理及单调性极限论证，先取 $\\tau\\to0$，再取 $\\varepsilon\\to0$，识别广义全变分通量。
- 利用能量不等式、时间平移和 $\\omega$-极限序列，将伪抛物项的交叉项分成有界与无界两种情形，并以附录中的单调序列引理取得非负下极限。
- 在 $\\beta$ 指数衰减时用 Gronwall 不等式获得 $\\sqrt\{\\beta\}\\nabla u$ 的全局有界性；在一般衰减条件下作 $t=e^s-1$ 的时间重标度，并通过线性化问题 $\(LPS\)^\\varepsilon$ 去除加权时间导数估计。

**可能的突破**

核心贡献是解决有限时间解属于 $H^1$ 而稳态解自然属于 $BV$ 所造成的极限识别障碍。论文给出从全局适定性到稳态关联的三级结论：仅有 $\\partial\_t\\beta\\le0$ 时保证至少一个 $\\omega$-极限点是稳态；指数衰减时提升为所有 $\\omega$-极限点；严格凸势与额外多项式条件下则证明整个解轨道收敛到唯一的 $BV$ 稳态，并覆盖图像处理中的正系数常数情形。

**限制与不确定性**

基本假设下只保证至少一个 $\\omega$-极限点满足稳态问题，不能推出全轨道收敛或稳态唯一。所有极限点结论需要 $f-f\_\\infty$ 的时间可积性，全部极限点结论还需 $\\beta$ 指数衰减；全轨道结论进一步要求 $g'\\ge C\_\{g'\}&gt;0$、系数加权导数条件及对 $f$ 的时间正则性。论文主要给出收敛和有界性，不提供一般情形下的显式收敛速率；$\\varepsilon=0$ 时线性化论证不能直接使用，只能由 $\\varepsilon\\to0$ 的统一估计补足。

**证明逻辑/大纲**

1. **主张：** 时间离散问题逐层可解，并得到独立于离散参数的能量与幅值估计。
   - **路线：** 对 $\(AP\)\_\\tau^\\varepsilon$ 定义包含二次时间项、梯度增量项、广义全变分项和截断势的泛函 $\\Upsilon^\\varepsilon$。$G\_M$ 的半凸性与 $\\alpha\\ge\\delta\_\\alpha$ 使小步长下泛函严格凸，故每层存在唯一极小元；用解增量测试离散方程得到式 $\(3\.5\)$，再用比较原理和 Gronwall 控制 $\|u\|\\le M$，为连续极限提供统一界。
2. **主张：** 取 $\\tau\\to0$ 和 $\\varepsilon\\to0$ 后获得全局解，并由差值估计证明唯一性。
   - **路线：** 离散插值由 Lemma 3\.2 给出 $L^\\infty\(0,T;V\)$ 与 $W^\{1,2\}\(0,T;V\)$ 界，Aubin 型紧性给出强 $C\(\[0,T\];H\)$ 收敛。通过伪抛物交叉项的下半连续估计 $\(3\.19\)$--$\(3\.26\)$ 以及统一凸性，得到梯度强收敛并传递变分恒等式。随后令 $\\varepsilon\\to0$，以弱星收敛的通量和次微分图闭性识别 $\\omega\_0^\*\\in\\partial\\gamma\_0\(\\nabla u^0\)$；最后对两个解作差，使用单调性与 $J^\\varepsilon$ 的 Gronwall 估计闭合唯一性。
3. **主张：** 在基本长时间假设下，至少存在一个 $\\omega$-极限点满足稳态变分不等式。
   - **路线：** Lemma 4\.1 由测试函数 $\\partial\_tu^\\varepsilon$ 得到能量不等式 $\(4\.1\)$，从而获得时间导数耗散、伪抛物加权耗散和统一 $BV\\cap L^\\infty$ 界。若某些时刻的 $\\sqrt\{\\beta\}\\nabla u^\\varepsilon$ 有界，则时间平移解在 $C\(\[0,1\];H\)$ 中趋于常值，代入变分式后伪抛物交叉项趋于零；若该量无界，则用附录 Lemma 5\.1 选择满足 $\(4\.12\)$ 的时刻，使交叉项下极限非负。两种情形都得到稳态变分不等式 $\(4\.10\)$ 或 $\(4\.13\)$。
4. **主张：** 当 $\\beta$ 指数衰减时，每一个 $\\omega$-极限点都是稳态解。
   - **路线：** 以 $u^\\varepsilon$ 测试演化方程，利用 $\\partial\_t\(e^\{Ct\}\\beta\)\\le0$、$g$ 的局部单调性和 Gronwall 不等式，对 $Y^\\varepsilon\(t\)=\\\|\\sqrt\{\\alpha\}u^\\varepsilon\(t\)\\\|\_H^2\+\\\|\\sqrt\{\\beta\}\\nabla u^\\varepsilon\(t\)\\\|\_\{\[H\]^N\}^2$ 得到式 $\(4\.18\)$，因而 $\\sqrt\{\\beta\}\\nabla u^\\varepsilon$ 全局有界。对任意 $\\omega$-极限序列作时间平移，耗散性给出时间导数趋于零，统一界使伪抛物交叉项 $\(4\.23\)$ 趋于零，再沿 Main Theorem 2 的极限过程得到该极限点属于 $S\_\\infty^\\varepsilon$。
5. **主张：** 严格凸势条件下，时间重标度和线性化问题给出无权时间导数可积性，进而得到唯一稳态与全轨道收敛。
   - **路线：** 令 $w^\\varepsilon\(s\)=u^\\varepsilon\(e^s-1\)$，则重标度后的伪抛物系数含有指数权。对 $\\varepsilon\\in\(0,1\)$ 构造线性化问题 $\(LPS\)^\\varepsilon$，Lemma 4\.3 证明其解等于 $\\partial\_sw^\\varepsilon$；测试线性化方程并结合 $g'\\ge C\_\{g'\}$ 得到式 $\(4\.33\)$，从而去除能量估计中的指数权。对 $\\varepsilon=0$ 使用统一估计 $\(4\.34\)$ 和弱收敛 $\(4\.35\)$ 传递该性质。严格凸性使 $F^\\varepsilon$ 严格凸，故 $S\_\\infty^\\varepsilon$ 为单点；结合所有 $\\omega$-极限点均为稳态，推出整个轨道收敛。

**排序理由**

正文核查显示该文围绕“存在性与长时间渐近”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 82/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--37 页全文，包括摘要、引言、全部主定理及证明、附录、首页资助脚注、正文末尾和 References；未发现作者明确披露 AI、LLM、软件或工具用于研究、证明、写作、代码、编辑、校对、翻译、排版、图表或插图。首页脚注仅说明 JST SPRING 与 JSPS KAKENHI 资助，正文末尾未见 Acknowledgments、AI 使用或工具声明。

**原始英文摘要**

In this paper, we study the well-posedness and large-time behavior of a pseudo-parabolic problem associated with a generalized total variation energy in the $BV$-framework\. A main mathematical issue arises from the mismatch between the Sobolev regularity of solutions at finite times and the $BV$-structure of the corresponding steady-state problem\. We prove the existence and uniqueness of solutions and investigate the relationship between their large-time behavior and solutions to the steady-state problem\. Moreover, our results include the convergence of the solution trajectory to the unique steady-state solution under a typical setting arising in image processing\.

---

#### A note on p-harmonic measure

- **作者：** José González Llorente
- **arXiv：** [2609\.12176](https://arxiv.org/abs/2609.12176) · [PDF](https://arxiv.org/pdf/2609.12176)
- **分类：** math\.AP
- **进展类型：** 新结果/测度衰减渐近下界
- **阅读优先级：** 79/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文证明：对 $1&lt;p&lt;2$，单位圆盘中弧 $I\_t$ 的 $p$-调和测度满足 $\\omega\_p\(I\_t,0,\\mathbb D\)\\ge b\\,t^q/\(\\log\(1/t\)\)^\\beta$，其中 $q=q\(p\)=\\frac\{3-p\+2\\sqrt\{p^2-3p\+3\}\}\{3\(p-1\)\}$；结合既有上界，推出任意 $1&lt;p&lt;\\infty$ 时指数为 $q$ 的 $p$-渐近幂律。正文已核查至 PDF 第 9 页。

**使用技术**

- 通过平移与旋转把单位圆盘弧问题化为截断圆盘 $D$ 与区域 $G$，并用几何关系 $\\sin\\alpha\\le r$ 控制边界。
- 采用 Aronsson 奇异拟径向函数 $h\(re^\{i\\alpha\}\)=r^\{-q\}f\(\\alpha\)$，结合比较原理在 $E\_1,E\_2,E\_3$ 三段边界逐段估计。
- 在 $z=i\\sqrt t$ 处评价主要化不等式，利用 Carleson 估计、函数对称性与 $q&gt;1$ 吸收误差，得到中间下界。
- 利用 $p$-拉普拉斯方程的伸缩不变性、Markov 性质和 Harnack 不等式建立跨尺度递推。
- 将递推归一化为 $\\phi\(t\)=\\omega\_p\(I\_t,0,\\mathbb D\)/t^q$ 的 $\\phi\(t^2\)\\ge C\\phi\(t\)$，迭代得到对数修正下界。

**可能的突破**

关键新点是处理 $1&lt;p&lt;2$ 时拟径向函数等值线从圆盘边界逃逸的障碍：Lemma 2\.2 加入误差项 $C\_2t^\{\(q\+1\)/2\}$，仍完成边界比较；随后通过重标度和函数不等式得到定理 1\.3 的对数修正下界，并与既有上界共同确定渐近指数 $q$。

**限制与不确定性**

定理 1\.3 的下界带有 $\(\\log\(1/t\)\)^\{-\\beta\}$ 因子，因此正文未证明无对数损失的纯 $p$-幂律下界；Remark 1\.5 明确指出该因子可能只是证明方法造成，需更强的势论工具才能判断。结果还依赖 Lundström--Vasilis 的既有上界来推出 Corollary 1\.4，并非独立重证整个 $1&lt;p&lt;\\infty$ 范围。

**证明逻辑/大纲**

1. **主张：** 建立平移旋转后的几何模型，并选取适合比较的奇异拟径向函数。
   - **路线：** 先把单位圆盘、弧和观测点平移旋转到 $D=D\(i\(1-t\),1\)$、$I'\_t$ 与原点附近，再取 $G=D\\cap\\\{y&gt;0,\\ \|z\|&gt;t\\\}$。在 $E\_3$ 上由圆方程得到 $r\\ge\\sqrt\{2t-t^2\}$ 与 $\\sin\\alpha\\le r$；取 $h\(re^\{i\\alpha\}\)=r^\{-q\}f\(\\alpha\)$，利用 $f$ 的端点值、对称性和单调性准备边界比较。
2. **主张：** 在截断区域 $G$ 上证明调整后的主要化估计 $t^qh\(z\)\\le C\_1\\omega\_p\(I'\_t,z,D\)\+C\_2t^\{\(q\+1\)/2\}$。
   - **路线：** 令 $v=t^qh$、$w=C\_1\\omega\+C\_2t^\{\(q\+1\)/2\}$，对 $\\partial G=E\_1\\cup E\_2\\cup E\_3$ 使用比较原理。在 $E\_1$ 上用 Carleson 估计给出 $\\omega\\ge c$；在 $E\_2$ 上由 $f\(0\)=f\(\\pi\)=0$ 得 $v=0$；在 $E\_3$ 上用 $f'\(\\alpha\)$ 的有界性和 $\\sin\\alpha\\le r$，再结合 $q&gt;1$ 与 $r\\ge t^\{1/2\}$，把 $v$ 控制到 $C\_2t^\{\(q\+1\)/2\}$。
3. **主张：** 在 $z=i\\sqrt t$ 处吸收误差，得到中间下界 $\\omega\_p\(I\_t,1-\\sqrt t,\\mathbb D\)\\ge Ct^\{\(q\+1\)/2\}$。
   - **路线：** 由 $h\(i\\sqrt t\)=t^\{-q/2\}$，将 Lemma 2\.2 代入该点后得到主项 $t^\{q/2\}$ 与误差项 $C\_2t^\{\(q\+1\)/2\}$；选取足够小的 $t\_0$ 使 $C\_2\\sqrt t\\le 1/2$，即可隔离出测度项的下界，再用平移和旋转把结论写回单位圆盘。
4. **主张：** 通过 Markov、Harnack 和伸缩不变性得到递推，并由函数不等式完成定理 1\.3。
   - **路线：** 对内圆盘 $D'=D\(0,1-\\sqrt t\)$ 及边界弧 $J\_t$ 使用 Markov 性质和 Harnack 不等式，得到 $\\omega\_p\(I\_t,0,\\mathbb D\)\\ge Ct^\{q/2\}\\omega\_p\(I\_\{\\sqrt t\},0,\\mathbb D\)$；将 $t$ 替换为 $t^2$ 后，对归一化量 $\\phi\(t\)=\\omega\_p\(I\_t,0,\\mathbb D\)/t^q$ 得到 $\\phi\(t^2\)\\ge C\\phi\(t\)$。Lemma 3\.1 迭代该关系并利用 $\\phi$ 在固定区间上的正下界，导出 $\\phi\(t\)\\ge b/\(\\log\(1/t\)\)^\\beta$，从而闭合主定理。

**排序理由**

正文核查显示该文围绕“新结果/测度衰减渐近下界”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 79/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--9 页全文，包括引言、主结果、全部证明、参考文献、末页作者信息，并检查致谢、AI/LLM 与工具或软件披露；未见独立致谢节，也未见作者明确披露 AI 使用。第 1 页仅见基金资助说明。

**原始英文摘要**

For 1 &lt; p &lt; 2 we obtain the asymptotic optimal decay of the p-harmonic measure of an arc of the unit circle, complementing previous results by Lundstr\\"om and Vasilis\.

---

#### Lipschitz Stability Estimates for Master Fields with Measure-Variable Regularity in Mean Field Games

- **作者：** Chen Geng、Hongyu Liu、Minghui Song
- **arXiv：** [2609\.12692](https://arxiv.org/abs/2609.12692) · [PDF](https://arxiv.org/pdf/2609.12692)
- **分类：** math\.AP
- **进展类型：** 平均场博弈主场与测度导数终端稳定性
- **阅读优先级：** 78/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--31 页。论文研究平均场博弈主方程在测度变量上的正则性，比较具有相同 Hamiltonian 和运行成本、但终端成本可能不同的两个经典解。作者沿特征测度流推导测度泛函导数满足的非局部抛物方程，建立两层 Carleman 估计，并控制特征流差异，最终得到主场及其测度导数从终端数据到内部的 Lipschitz 稳定性。

**使用技术**

- 概率测度空间上的泛函导数与 Lions 导数链式法则
- 特征测度流与线性化 MFG 系统表示
- 测度导数的非局部抛物方程推导
- 加权 Carleman 估计与非局部项吸收
- 特征流能量估计、Gronwall 不等式与终端到内部稳定性

**可能的突破**

核心进展是把 Carleman 稳定性分析提升到平均场博弈主方程层面，并进一步覆盖测度泛函导数。论文先沿特征测度流获得主场差的终端到内部 Lipschitz 控制，再推导测度导数核满足的非局部抛物方程，通过第二个 Carleman 估计和特征流差异控制，得到主场与测度导数同时受终端差异控制的估计 4\.34。

**限制与不确定性**

结论依赖两组经典主方程解及其测度导数具有足够高的正则性，并要求特征密度、漂移、Hamiltonian 二阶导数和测度导数满足统一有界性及 Lipschitz 条件 4\.31--4\.33。主结果针对无共同噪声、有限时间区间 $\[0,T\]$、同一 Hamiltonian 和运行成本的终端成本扰动，稳定性沿可 admissible 特征测度流表述；未覆盖弱解、低正则测度流、长时间极限、非单调结构、共同噪声或一般 Hamiltonian 扰动的完整测度导数稳定性。

**证明逻辑/大纲**

1. **主张：** 沿特征测度流表示主方程，并推导测度导数核满足的非局部抛物方程。
   - **路线：** 先用测度变量链式法则和 Fokker--Planck 方程证明主场沿流限制满足 Hamilton--Jacobi 方程；再用线性化 MFG 系统把测度导数表示为核 $K$ 对初始测度扰动的积分。对该表示式求时间导数，代入线性化系统并两次分部积分，得到含非局部二次梯度项的方程；对零总质量扰动测试说明剩余项仅依赖 $\(t,x\)$，再用测度导数归一化证明该剩余项为零。
2. **主张：** 主场差沿参考特征流满足终端到内部 Lipschitz 稳定性。
   - **路线：** 用均值定理线性化 Hamiltonian 和漂移差，将两个主方程相减写成关于 $U=U\_1-U\_2$ 的线性非局部方程；定义沿参考流的导数算子和非局部算子 $\\mathcal\{P\}$。对加权函数 $e^\{\\lambda\(t\+a\)^\\nu\}$ 作用下的后向抛物方程进行时间和空间分部积分，得到梯度与函数本身的 Carleman 控制；非局部项由 Cauchy--Schwarz 和密度有界性转化为梯度项，再选足够大的 $\\lambda$ 吸收。
3. **主张：** 测度导数差满足相应非局部抛物方程，并可由第二个 Carleman 估计控制。
   - **路线：** 对两条特征流上的测度导数核 $K\_1$、$K\_2$ 相减，将所有含核差的非局部项留在左端，得到算子 $\\mathcal\{L\}\_K K=R\(U,m\)$；对双空间变量 $\(x,y\)$ 应用两变量 Carleman 估计，利用 $m\_i$、$D\_xK\_i$、$D\_yK\_i$ 和 Hamiltonian 系数的有界性，把两个非局部项估计为梯度范数并吸收，得到公式 4\.14。
4. **主张：** 控制两条特征测度流的差异，并估计测度导数方程的源项。
   - **路线：** 由两个 Fokker--Planck 方程相减得到测度差方程 4\.24；使用主场测度 Lipschitz 正则性估计漂移差，再对测度差做 $L^2$ 能量估计并应用 Gronwall 不等式，得到公式 4\.22。随后利用 Hamiltonian 二阶导数条件、运行成本测度导数条件和 Proposition 4\.2，逐项控制源项 $R\(U,m\)$，获得公式 4\.40；终端核差则由测度导数 Lipschitz 条件估计。
5. **主张：** 组合两层 Carleman 估计，得到主场和测度导数的终端到内部 Lipschitz 稳定性。
   - **路线：** 将 Theorem 3\.1 应用于主场差，得到公式 4\.35；用特征流稳定性将测度差控制在终端主场差之下，再将这些界代入 Theorem 4\.2 控制核差。最后通过测度导数的定义和 $U\_2$ 对测度变量的 Lipschitz 正则性，将参考流上的核差恢复为主场测度导数差，合并得到终端数据和终端测度导数差控制内部两项。

**排序理由**

正文核查显示该文围绕“平均场博弈主场与测度导数终端稳定性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 78/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：论文 PDF 全文逐页核查（第 1--31 页），覆盖正文各节、定理证明、正文末尾及 References；全文执行 AI/LLM 相关关键词检索，未发现相关披露。

**原始英文摘要**

In this paper, we investigate the Lipschitz stability of the master field and its functional derivative with respect to the measure variable for the master equation in mean field games\. A key novelty of this work is the derivation of a nonlocal parabolic partial differential equation governing the functional measure derivative along a characteristic measure flow\. Based on this equation, we establish a Carleman estimate for the difference of the measure derivatives associated with two sufficiently regular classical solutions\. We also establish a Carleman estimate for the difference of the corresponding master fields, yielding a terminal-to-interior Lipschitz stability estimate along a characteristic measure flow\. Together with stability of the associated measure flows, these estimates are used to control the resulting source terms\. We then obtain a terminal-to-interior Lipschitz stability estimate for both the master field and its functional measure derivative in terms of the discrepancies of the terminal data\. The result provides quantitative control of the master field with measure-variable regularity, and develops a Carleman-based framework for the stability analysis of master fields and their measure derivatives in mean field game master equations\.

---

#### Least energy sign-changing solutions for asymptotically cubic Kirchhoff equations on locally finite graphs

- **作者：** Shuai An、Junping Xie、Xingyong Zhang
- **arXiv：** [2609\.12526](https://arxiv.org/abs/2609.12526) · [PDF](https://arxiv.org/pdf/2609.12526)
- **分类：** math\.AP
- **进展类型：** 图上 Kirchhoff 变号解最小能量存在性
- **阅读优先级：** 62/100 · 中优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--18 页。论文研究局部有限加权图上的 Dirichlet Kirchhoff 方程，在渐近三次非线性条件下，通过非 Nehari 流形变分方法构造最小能量变号解与常号基态解，并证明变号解能级严格满足 $m&gt;2c$。

**使用技术**

- 加权局部有限图上的离散 Sobolev 空间与紧嵌入
- Kirchhoff 能量泛函、弱解与点态解对应
- 非 Nehari 流形与正负部分分解
- Poincaré--Miranda 定理和单调缩放参数构造
- 有限维紧性、极小化序列收敛与能级比较

**可能的突破**

论文将渐近三次 Kirchhoff 方程的最小能量变号解存在性推进到局部有限图，并允许任意 $p\\in\[4,\+\\infty\)$ 的增长，因为有界图域上的 $H\_0^\{1,2\}\(\\Omega\)$ 是有限维的。核心结果是在条件 $\\mathrm\{\(F1\)\}$--$\\mathrm\{\(F4\)\}$ 下构造 $\\tilde u\\in M$ 与 $\\bar u\\in N$，分别达到变号能级 $m$ 和基态能级 $c$，再利用正负部分的独立缩放与严格正的交互项得到 $m&gt;2c$。

**限制与不确定性**

结论依赖局部有限加权图、有界域及 $\\Omega^\\circ\\ne\\varnothing$、$\\partial\\Omega\\ne\\varnothing$，并要求 $a&gt;0$、$b\\ge0$、渐近分解 $f\(t\)=lt^3\+f\_\\infty\(t\)$、$l&gt;b\\mu\_0$ 和条件 $\\mathrm\{\(F1\)\}$--$\\mathrm\{\(F4\)\}$。结果只处理有界图域上的存在性与能级比较，未给出无界图、一般非渐快三次非线性、全局参数连续性、多重性或解的渐近行为。作者明确指出，含 $\\lambda u\+\\eta\|u\|^2u$ 的已知模型因不满足 $\\mathrm\{\(F2\)\}$ 仍未被覆盖。

**证明逻辑/大纲**

1. **主张：** 建立能量泛函的基本变分不等式，并控制正负部分的缩放能量。
   - **路线：** 从 Kirchhoff 能量泛函及其导数出发，利用渐近分解条件推出关于 $f$ 和 $F$ 的点态不等式，再结合 Poincaré 不等式得到对 $I\(u\)-I\(su^\+\+tu^-\)$ 的下界；所有剩余项由交互量 $W\_u$、正负部分范数和平方差项控制，从而在 $s=t$ 时获得单参数能量下降。
2. **主张：** 对每个具有非零正负部分的试探函数，构造唯一的正缩放对使其落入变号约束流形 $M$。
   - **路线：** 定义集合 $E$，先由导数不等式和估计 3\.6、3\.8--3\.9 证明 $M\\subset E$；对 $u\\in E$ 构造 $G\(s,t\)$ 与 $H\(s,t\)$，利用小参数时为正、大参数时为负的估计 3\.13--3\.16 及 Poincaré--Miranda 定理得到零点。再把 Lemma 3\.1 分别应用于两个候选缩放对，利用严格正项证明缩放对唯一，并将 $\\inf\_M I$ 化为 $E$ 上的双缩放极大值。
3. **主张：** 对常号基态约束流形 $N$ 建立唯一单参数缩放，并将基态能级转化为可极大化的变分问题。
   - **路线：** 定义集合 $G$，由 $\\langle I'\(u\),u\\rangle\\le0$ 推出 $N\\subset G$；对 $u\\in G$ 考察 $\\phi\(t\)=\\langle I'\(tu\),tu\\rangle$，用小 $t$ 的正性和大 $t$ 的负性获得零点，再用 Corollary 3\.4 的严格能量不等式排除两个不同正缩放。由此得到 $\\inf\_N I$ 等于 $G$ 上单缩放极大值。
4. **主张：** 极小化序列达到两个能级，极小元是临界点，并完成严格能级比较。
   - **路线：** 对 $M$ 和 $N$ 上的极小化序列分别使用公式 3\.25、3\.30 得到有界性；利用图域有限导致的有限维紧性抽取强收敛子列，并通过公式 3\.27--3\.29 保证极限的正负部分不消失，从而达到 $m$ 和 $c$。Lemma 3\.18 将极小元提升为临界点；最后利用 Corollary 3\.5 的双缩放极大性、Lemma 3\.15 对正负部分的单缩放以及 $W\_\{\\tilde u\}&gt;0$，得到 $m&gt;2c$。

**排序理由**

正文核查显示该文围绕“图上 Kirchhoff 变号解最小能量存在性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 62/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：论文 PDF 全文逐页核查（第 1--18 页），覆盖正文、证明、Funding information、Conflict of interest、Authors' contribution 与 References，并执行 AI/LLM 相关关键词检索。

**原始英文摘要**

We obtain the existence results of least energy sign-changing solutions and ground state solutions for a class of asymptotically cubic Kirchhoff equations with Dirichlet boundary value on a locally finite graph $G=\(V,E\)$, and obtain the least energy of sign-changing solutions is strictly larger than twice of the ground state energy\.

---

### 色散方程

#### Scattering Across the Long-Range Threshold for One-Dimensional Nonlinear Schr\\"odinger Equations

- **作者：** Yonggeun Cho、Jinyeop Lee
- **arXiv：** [2609\.12423](https://arxiv.org/abs/2609.12423) · [PDF](https://arxiv.org/pdf/2609.12423)
- **分类：** math\.AP
- **进展类型：** 新结果/联合极限散射渐近
- **阅读优先级：** 92/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究一维非线性 Schrödinger 方程族 $i\\partial\_tu\_\\delta=-\\partial\_x^2u\_\\delta\+\\kappa\|u\_\\delta\|^\{2\+\\delta\}u\_\\delta$ 在 $\\delta\\to0^\+$ 与 $t\\to\\infty$ 的联合极限。对足够小的 $H^\{0,1\}\(\\mathbb R\)$ 初值，作者建立对 $\\delta$ 一致的全局质量类解和物理空间渐近公式，引入非线性时钟 $P\_\\delta\(t\)=2\(1-t^\{-\\delta/2\}\)/\\delta$，并以 $\\lambda=\\delta\\log t$ 区分短时钟、转变和饱和三种区间；同时给出有限阶 Taylor 时钟层级及指数方向一阶系数修正。

**使用技术**

- 用自相似变换 $u\_\\delta\(t,x\)=\(2t\)^\{-1/2\}e^\{ix^2/\(4t\)\}a\_\\delta\(t,x/\(2t\)\)$ 把物理空间问题转为振幅方程，并用加权质量空间 $H^\{0,1\}$ 和 Galilean 场 $J\(t\)=x\+2it\\partial\_x$ 传播空间权重。
- 使用一维端点 Strichartz 估计、质量守恒和小数据吸收建立对 $\\delta$ 与符号 $\\kappa$ 一致的全局解、衰减及 Sobolev 振幅界。
- 以小 Schrödinger 传播子 $S\(t\)$ 共轭振幅，分离主导非线性相位；通过余项估计、$H^\{3/4\}$ 乘积控制和耦合 bootstrap 得到可积时间导数与极限轮廓。
- 引入参数商 $q\_\\delta,h\_\\delta,k\_\\delta,g\_\\delta$，沿解、振幅、共轭振幅、去相位轮廓和相位缺陷逐层做指数一阶展开，并用均值公式、对偶性和 Bochner 支配收敛闭合。
- 对非线性时钟使用精确恒等式、Taylor 余项界和尺度条件，解析 $\\lambda=\\delta\\log t$ 的三种极限以及有限阶修正的物理时间层级。

**可能的突破**

核心贡献是构造了在 $\\delta=0$ 附近仍然统一有效的显式非线性时钟 $P\_\\delta\(t\)$，从而把立方方程的修正散射与正幂方程的普通散射放入同一联合极限框架。Theorem 2\.4 证明了随 $\\delta$ 变化的无限 Taylor 相位层级，Theorem 2\.5 保留精确时钟并在转变和饱和区间显式识别由轮廓系数一阶变化产生的有限相位修正。

**限制与不确定性**

结果限于足够小的 $H^\{0,1\}\(\\mathbb R\)$ 初值、$0\\le\\delta\\le\\delta\_0$ 和一维方程，未覆盖大数据或更高维情形；$H^\{0,1\}$ 不要求物理空间导数，散射结论主要在 $L^2$ 中给出，$H^\{3/4\}$ 只用于轮廓控制。有限阶时钟替换必须满足 $\\delta\_n^\{m\+1\}\(\\log t\_n\)^\{m\+2\}\\to0$，仅有 $\\delta\_n\\log t\_n\\to0$ 不足以保证绝对相位误差为 $o\(1\)$；转变和饱和区间用极限时钟替换也需要额外的序列条件。

**证明逻辑/大纲**

1. **主张：** 小的 $H^\{0,1\}$ 初值产生对指数参数一致的全局质量类解，并获得自相似振幅、衰减和权重控制。
   - **路线：** 先在质量 Strichartz 空间中用一维端点估计和时间 Hölder 不等式对 Duhamel 映射做统一收缩，质量守恒后按单位时间区间延拓。再对 Galilean 场 $J\(t\)$ 的方程使用同样的吸收估计传播空间权重，在 $t=1$ 转换到自相似振幅并重启演化；最后由振幅方程的条件微分不等式与耦合 bootstrap 得到 $H^1$ 增长、$L^\\infty$ 有界和 $t^\{-1/2\}$ 物理衰减。
2. **主张：** 去除主导非线性相位后，构造统一的渐近轮廓 $W\_\\delta$，满足 $a\_\\delta\(t\)=e^\{-i\\Phi\_\\delta\[W\_\\delta\]\(t\)\}W\_\\delta\+O\_\{L^2\}\(t^\{-1/16\}\)$。
   - **路线：** 令 $A\_\\delta=S\(t\)a\_\\delta$，把振幅方程写成主相位项加传播子余项 $R^\\sharp\_\\delta$；小传播子估计和非线性 Lipschitz 界给出余项的 $L^2$、$H^1$、$H^\{3/4\}$ 衰减。再定义演化相位 $\\Theta\_\\delta$ 并令 $b\_\\delta=e^\{i\\Theta\_\\delta\}A\_\\delta$，主非线性项精确抵消，余项时间可积，于是 $b\_\\delta$ 收敛到 $Z\_\\delta$。比较演化密度与极限密度构造相位缺陷 $\\Gamma\_\\delta$，设置 $W\_\\delta=e^\{-i\\Gamma\_\\delta\}Z\_\\delta$ 后恢复冻结相位并完成物理渐近。
3. **主张：** 沿指数参数建立轮廓、相位缺陷及非线性系数的一阶展开，得到 Theorem 2\.7 的显式修正。
   - **路线：** 以 $q\_\\delta=\(u\_\\delta-u\_0\)/\\delta$ 和 $h\_\\delta=\(a\_\\delta-a\_0\)/\\delta$ 控制解与振幅商，再经 $S\(t\)$ 得到共轭振幅商。对含 $\\log\|u\|$ 的参数导数使用分裂幂次估计，结合端点 Strichartz、加权场和 Grönwall 得到统一 $H^1$ 多项式界。对去相位轮廓商和相位密度商保留尾部衰减，利用均值公式中的结构性抵消获得可积导数，最后用支配收敛和乘积展开推出 $Z\_\\delta$、$\\Gamma\_\\delta$、$W\_\\delta$ 及 $2^\{-1-\\delta/2\}\|W\_\\delta\|^\{2\+\\delta\}$ 的一阶公式。
4. **主张：** 精确时钟与系数展开结合后，得到 $\\lambda=\\delta\\log t$ 的三种联合极限散射公式。
   - **路线：** 使用 $P\_\{\\delta\_n\}\(t\_n\)=2\(1-e^\{-\\lambda\_n/2\}\)/\\delta\_n$，把系数的一阶 $o\_\{L^2\}\(\\delta\_n\)$ 误差乘以有界的时钟因子，得到以 $W\_0$ 为主轮廓和以 $1-e^\{-\\lambda\_n/2\}$ 加权的有限相位修正。若 $\\lambda\_n\\to0$，修正相位消失；若 $\\lambda\_n\\to\\Lambda\\in\(0,\\infty\)$，保留有限转变修正；若 $\\lambda\_n\\to\\infty$，权重趋于一并得到饱和公式。
5. **主张：** Taylor 时钟余项给出有限阶层级，并通过自相似幺正变换闭合 Theorems 2\.4 和 2\.5。
   - **路线：** Lemma 6\.3 由指数函数 Taylor 定理给出 $\|P\_\\delta\(t\)-P\_\\delta^\{\(m\)\}\(t\)\|\\le\\delta^\{m\+1\}\(\\log t\)^\{m\+2\}/\(2^\{m\+1\}\(m\+2\)\!\)$；在相应尺度条件下，这一误差为 $o\(1\)$，而 $\\log t\\sim c\\delta^\{-m/\(m\+1\)\}$ 时第 $m$ 阶项产生有限相位。第 7 节分别调用 Theorem 6\.4 和 Proposition 6\.1，将时钟替换或精确时钟公式与轮廓渐近结合，最后用自相似变换的幺正性把 $L^2\_v$ 结论转回 $L^2\_x$。

**排序理由**

正文核查显示该文围绕“新结果/联合极限散射渐近”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 92/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--31 页全文，包括摘要、引言、第 2--6 节全部引理、命题、定理及证明、第 7 节主定理证明、Acknowledgment、References 和正文末尾；未见作者明确披露 AI、LLM、软件或工具用于研究、证明、写作、代码、编辑、校对、翻译、排版、图表或插图。Acknowledgment（PDF 第 30 页）仅致谢 Chulkwang Kwak 的问题及列出研究资助。

**原始英文摘要**

We study small solutions to the one-dimensional nonlinear Schr\\"odinger family \\\[ \\mathrm\{i\}\\partial\_t u\_\\delta=-\\partial\_x^2u\_\\delta\+\\kappa\|u\_\\delta\|^\{2\+\\delta\}u\_\\delta, \\qquad 0\\leq\\delta\\leq\\delta\_0, \\\] uniformly as $\\delta\\to0^\+$ and $t\\to\\infty$, across the threshold between cubic modified scattering and nearby-power ordinary scattering\. For initial data small in $H^\{0,1\}\(\\mathbb\{R\}\)$, with one spatial weight and no physical derivative assumed, we prove a joint-limit asymptotic formula governed by an explicit nonlinear clock\. The variable $ \\delta\\log t$ gives three regimes according as it tends to zero, a positive finite limit, or infinity\. Within the regime $\\delta\\log t\\to0$, successive Taylor terms of the clock become visible at an infinite hierarchy of time scales, each requiring finer absolute phase accuracy\. These scales accumulate at the transition scale, where the exact clock describes them together\. In the transition and saturated regimes, the clock is of order $\\delta^\{-1\}$, so the first-order variation of its coefficient contributes a finite phase correction\.

---

#### Large-data modified wave operators for the defocusing nonlinear Schr\\"odinger equation in one space dimension with subcritical long-range nonlinearity

- **作者：** Masaki Kawamoto、Haruya Mizutani
- **arXiv：** [2609\.12518](https://arxiv.org/abs/2609.12518) · [PDF](https://arxiv.org/pdf/2609.12518)
- **分类：** math\.AP
- **进展类型：** 新结果/大数据修正散射
- **阅读优先级：** 90/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究一维去聚焦非线性 Schrödinger 方程 $i\\partial\_tu\+\\frac12\\Delta u=\\lambda\|u\|^\{2\\sigma\}u$ 在次临界长程区间 $\\frac\{2\}\{\\sqrt7\}&lt;\\sigma&lt;1$ 的终态问题。对任意满足 $\\nu\_\*\(\\sigma\)&lt;\\nu&lt;\\frac\{\\sigma\}\{\\sigma-\\frac12\}$ 的加权散射数据 $u\_\+\\in FH^\\nu\(\\mathbb R\)$，作者构造唯一全局解，使其散射到带多项式非线性相位修正的指定轮廓，并建立加权 $L^2$、$L^2$ 及混合交叉项的定量衰减估计，从而证明修正波算子存在。

**使用技术**

- 用伪共形变换 $v\(s,x\)=\\mathrm\{PC\}\[u\]\(s,x\)$ 将无穷远终态问题转为 $s\\to0^\+$ 的奇异初值问题，并把物理空间误差等价为改进能量 $Q\[v-v\_p\]\(s\)$ 的衰减。
- 从 $w\_\\varepsilon=v\_\\varepsilon-v\_p$ 的方程中提取最奇异的线性部分，围绕渐近轮廓线性化，构造含时非对称 Hamilton 算子及其传播子 $U\(s,r\)$。
- 设计带相位修正的改进能量 $\\widetilde Q$，通过分部积分、Gagliardo--Nirenberg 不等式、Young 不等式和精确的非线性结构抵消控制非线性项与误差项。
- 先在 $s=\\varepsilon&gt;0$ 的正则化问题上获得与 $\\varepsilon$ 无关的能量界，再用弱紧性、局部强收敛、质量守恒和伪共形守恒律取 $\\varepsilon\\to0$。
- 对两个候选解的差重复线性化与改进能量估计，得到 Volterra 型不等式并由 Grönwall 引理证明唯一性，最后用伪共形恒等式转回原方程的终态散射估计。

**可能的突破**

论文首次在一维去聚焦次临界区间 $\\frac\{2\}\{\\sqrt7\}&lt;\\sigma&lt;1$ 为任意大小的加权 $L^2$ 散射数据构造修正波算子，摆脱解析性、非消失性或小数据条件。关键突破是把渐近轮廓的主导非线性项并入线性势，并利用线性化非线性中的特殊结构产生抵消，从而克服次临界相位的多项式增长及非线性在原点处的非光滑性。

**限制与不确定性**

结论限于一维去聚焦情形 $\\lambda&gt;0$、$\\frac\{2\}\{\\sqrt7\}&lt;\\sigma&lt;1$ 及指定的 $\\nu$ 区间，未覆盖聚焦问题、更高维度或临界端点的完整理论。改进能量估计要求额外的指数条件 $\(3\+2\\nu\)\\sigma-4-\(2\\nu-1\)\\delta&gt;0$，因此阈值和正则性端点通常不包含在结论内。散射数据属于加权 $L^2$ 空间，物理空间不预设普通 $H^1$ 导数；部分更高阶或更广泛数据类别未处理。

**证明逻辑/大纲**

1. **主张：** 伪共形变换把终态散射定理化为奇异时间端点问题及改进能量衰减。
   - **路线：** 将 $u$ 和指定终态轮廓 $u\_\{p,\+\}$ 变换为 $v$ 和 $v\_p$，得到 $s=t^\{-1\}$ 下的方程 $\(i\\partial\_s\+\\frac12\\Delta\)v=\\lambda s^\{\\sigma-2\}\|v\|^\{2\\sigma\}v$ 及显式轮廓方程。Lemma 1\.7 把加权误差、普通 $L^2$ 误差和交叉项分别转写为 $\\nabla\(v-v\_p\)$、$v-v\_p$ 及其与 $v\_p$ 的配对；因此 Theorem 1\.1 归结为证明 $Q\[v-v\_p\]\(s\)\\lesssim s^\{\\beta-\\delta\}$ 的 Theorem 1\.8。
2. **主张：** 在线性化传播子层面建立统一改进能量估计，控制最奇异线性势。
   - **路线：** 对从 $s=\\varepsilon$ 开始且初值为 $v\_p\(\\varepsilon\)$ 的解定义 $w\_\\varepsilon=v\_\\varepsilon-v\_p$，将非线性差分拆成主线性部分、二次以上余项 $G$ 和误差 $e\_1,e\_2$。把主线性部分写入含时 Hamilton 算子 $H\(s\)$，组成复共轭二分量系统并用传播子 $U\(s,r\)$ 表示。对该系统的解沿 $Q$ 求导，组合三个能量恒等式；两个负项直接耗散，另外两项由 Gagliardo--Nirenberg、Young 和参数 $\\nu$ 的条件吸收，得到 $Q\[U\(s,r\)\\psi\_0\]\(s\)\\lesssim Q\[\\psi\_0\]\(r\)$。
3. **主张：** 非线性余项的结构抵消使 $w\_\\varepsilon$ 满足与截断参数无关的衰减能量界。
   - **路线：** 定义带相位梯度的等价能量 $\\widetilde Q$，先用均值公式控制 $G$ 的大小，再利用 $\\operatorname\{Im\}\[v\_pG\]$ 中的特殊因子 $\\operatorname\{Re\}\[v\_pw\_\\varepsilon\]$ 获得比粗略二次估计更强的时间幂。对梯度项使用非线性导数的分解和分数阶链式估计，将所有项代入 Duhamel 公式并迭代吸收，得到 $Q\[w\_\\varepsilon\]\(s\)\\lesssim s^\{\\beta-\\delta\}$ 及 $H^\{-1\}$ Hölder 连续性。
4. **主张：** 令 $\\varepsilon\\to0$ 构造满足改进能量界的全局解，并完成存在性。
   - **路线：** 把平移后的 $w\_\\varepsilon$ 置于统一有界的 $C\(\[0,s\_1\],H^1\)$ 与 $H^\{-1\}$ 时间正则框架中，用抽象弱紧性定理提取子列。局部 Rellich 紧性给出非线性项的局部强收敛，质量守恒和弱下半连续性传递能量界；再用伪共形守恒律恢复 $H^1$ 强连续性，证明极限解满足方程、Duhamel 公式、质量守恒及 $Q\[v-v\_p\]\(s\)\\lesssim s^\{\\beta-\\delta\}$。
5. **主张：** 对解差应用同一改进能量机制得到唯一性，并回到原变量闭合主定理。
   - **路线：** 令 $W=v\_1-v\_2$，将其方程拆成关于 $v\_p$ 的主线性部分、非线性差分和轮廓误差；Proposition 2\.3 给出主传播子的能量控制，Proposition 3\.1 将余项界压为 $s^\{\\beta\_1\+1-\\sigma\}Q\[W\]\(s\)$。结合两解各自的衰减界并令截断端点趋于零，得到 $Q\[W\]\(s\)\\lesssim\\int\_0^s r^\{\\beta\_1-1\}Q\[W\]\(r\)\\,dr$，Grönwall 引理推出 $W=0$。最后由 Lemma 1\.7 将 Theorem 1\.8 的端点估计转回 Theorem 1\.1 的终态散射、波算子和三项衰减结论。

**排序理由**

正文核查显示该文围绕“新结果/大数据修正散射”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 90/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--40 页全文，包括摘要、引言、Theorem 1\.1、Theorem 1\.8、Sections 2--3 的全部证明、Appendix A、Acknowledgments、References 及正文末尾；未见作者明确披露 AI、LLM、软件或工具用于研究、证明、写作、代码、编辑、校对、翻译、排版、图表或插图。Acknowledgments（PDF 第 38 页）仅列出 JSPS KAKENHI 和京都大学数学科学研究所资助。

**原始英文摘要**

We study long-time behavior of the solutions to the final state problem for the defocusing nonlinear Schr\\"odinger equation \(NLS\) in one space dimension with the power nonlinearity $\|u\|^\{2\\sigma\}u$ in the subcritical long-range regime $\\frac\{2\}\{\\sqrt\{7\}\}&lt;\\sigma&lt;1$\. Given a prescribed asymptotic profile in a weighted $L^2$-space, without size restriction, obtained by modifying the free solution with a nonlinear polynomial phase correction, we construct a unique global solution of the NLS that scatters to this profile, thereby proving the existence of modified wave operators\. The proof relies on two new ingredients\. Extending our previous work for the cubic case, we incorporate the leading part of the nonlinear term into the linear part as a linear potential by linearizing the NLS around the asymptotic profile and prove a global modified energy estimate for the linearized equation\. We also exploit a specific structure of the nonlinearity arising from the linearization, which gives rise to a crucial cancellation when estimating the nonlinear terms in the modified energy space and enables us to control the polynomial growth of the nonlinear phase correction in the subcritical case\.

---

#### Dispersive decay and scattering for continuum Calogero--Moser models

- **作者：** Rowan Killip、Thierry Laurens、Jason Murphy、Monica Visan
- **arXiv：** [2609\.12985](https://arxiv.org/abs/2609.12985) · [PDF](https://arxiv.org/pdf/2609.12985)
- **分类：** math\.AP
- **进展类型：** 小质量色散衰减与散射
- **阅读优先级：** 88/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究聚焦和散焦连续 Calogero--Moser 模型的小质量解。作者利用显式解公式、改进的 resolvent 估计和精确守恒的 Galilean 向量场，证明初值属于 $L^1$ 时的点态色散衰减，并在 $xq\\in L^2$ 时得到带定量速率的线性 Schrödinger 散射。

**使用技术**

- Hardy 空间上的显式 resolvent 公式
- 小质量 Born 级数展开
- 半群共轭与 $L^1\_\+\\to L^\\infty\_\+$ 算子估计
- Galilean 向量场 $J\_q\(t\)=X-2tL\_q$
- 交换子恒等式
- Dollard 因子分解
- 加权 $L^2$ 估计与光滑初值逼近
- 时间导数可积性和 Cauchy 判据

**可能的突破**

定理 1\.5\(i\) 证明小质量且 $q\\in L^1$ 的解满足 $\\\|q\(t\)\\\|\_\{L\_x^\\infty\}\\lesssim \|t\|^\{-1/2\}\(1\+\\\|q\\\|\_\{L^2\}^2\)\\\|q\\\|\_\{L^1\}$。定理 1\.5\(ii\) 在 $xq\\in L^2$ 时进一步得到散射态 $q\_\\pm$ 以及 $\\\|q\(t\)-e^\{it\\Delta\}q\_\\pm\\\|\_\{L\_x^2\}\\lesssim \|t\|^\{-1\}$。该论证还说明非线性中的相位抵消使散射保持为未修正散射，不需要立方 Schrödinger 方程中常见的对数相位修正。

**限制与不确定性**

结果要求初值质量足够小，所需小质量阈值来自 Born 级数收敛且未给出具有物理意义的显式值。点态衰减要求 $q\\in L^1$，定量散射速率还要求 $xq\\in L^2$，因此没有在一般 $L^2$ 初值下给出收敛速率。方法本质上依赖连续 Calogero--Moser 模型的显式公式和可积结构，未覆盖大质量聚焦解、可能 blow-up 的区域或一般非可积扰动。

**证明逻辑/大纲**

1. **主张：** 命题 2\.5 建立小质量下统一的 resolvent 衰减估计。
   - **路线：** 将 $A\(t,z;q\)$ 写成自由 resolvent $A\_0\(t,z\)$ 与非线性扰动的 Born 级数。利用自由估计（2\.11）以及乘法算子 $qC\_\+q$ 的 $L^1\_\+\\to L^1\_\+$ 控制，每一阶都获得小因子 $\\\|q\\\|\_\{L^2\}^2$；当质量足够小时级数在 $L^1\_\+\\to L^\\infty\_\+$ 算子范数中几何收敛，并且界对 $\\operatorname\{Im\}z&gt;0$ 和非零 $t$ 一致。
2. **主张：** 定理 1\.5\(i\) 由显式解公式和 resolvent 恒等式推出 $\|t\|^\{-1/2\}$ 点态衰减。
   - **路线：** 把显式公式（1\.3）中的 $I\_\+A\(t,z;q\)q$ 分解为自由项和一次非线性 resolvent 项。自由项由 Schrödinger 色散估计控制；非线性项先使用 resolvent 恒等式，再结合命题 2\.5、Hardy 投影的 $L^2$ 有界性和 Cauchy--Schwarz，得到同阶的 $\|t\|^\{-1/2\}\\\|q\\\|\_\{L^2\}^2\\\|q\\\|\_\{L^1\}$ 控制。最后令上半平面高度趋于零，得到边界函数的 $L\_x^\\infty$ 估计。
3. **主张：** 交换子引理 2\.8 和恒等式（3\.3）给出非线性 Galilean 向量场的守恒控制。
   - **路线：** 先以带权光滑初值逼近一般满足 $xq\\in L^2$ 的初值，再对由 $P\_q\(t\)$ 生成的酉演化验证 $U\_n\(t\)X=\(X-2tL\_\{q\_n\(t\)\}\)U\_n\(t\)$。交换子 $\[X,P\_q\]=2L\_q$ 使两边的时间导数闭合，从而 $\\\|\(X-2tL\_\{q\_n\(t\)\}\)q\_n\(t\)\\\|\_\{L^2\}$ 等于初始加权范数；结合点态衰减控制非线性差异，得到 $\\\|\(x\+2it\\partial\_x\)q\_n\(t\)\\\|\_\{L^2\}$ 的一致界。
4. **主张：** Dollard 分解完成定理 1\.5\(ii\) 的散射构造和 $\|t\|^\{-1\}$ 速率。
   - **路线：** 令 $f\_n\(t\)=e^\{-it\\Delta\}q\_n\(t\)$ 并作 Dollard 分解 $q\_n=M\(t\)D\(t\)g\_n$。直接计算方程得到 $\\\|\\partial\_t\\widehat f\_n\(t\)\\\|\_\{L^2\}\\lesssim \|t\|^\{-2\}$，因此 $f\_n\(t\)$ 在 $L^2$ 中以 $O\(\|t\|^\{-1\}\)$ 速率收敛到 $q\_n^\+$。利用解的 $L^2$ 连续依赖证明 $q\_n^\+$ 是 Cauchy 列，再令逼近指标趋于无穷，得到一般初值的散射态 $q^\+$；负时间方向完全类似。

**排序理由**

正文核查显示该文围绕“小质量色散衰减与散射”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 88/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 全文、摘要、第 2--3 节、Acknowledgements、References 前后的正文末尾以及全部可见声明。Acknowledgements 仅说明研究项目和基金支持；未发现 AI、LLM 或相关工具使用声明。

**原始英文摘要**

We prove pointwise decay and scattering for small-mass solutions to the focusing and defocusing continuum Calogero--Moser models under suitable decay assumptions on the initial data\. Our proof is based on an explicit formula for solutions and the exact conservation of the Galilean vector field associated to the equation\.

---

#### Dispersive estimates for the Landau Hamiltonian on the hyperbolic plane

- **作者：** Huanqing Guo、Haoran Wang、Junyong Zhang、Jiqiang Zheng
- **arXiv：** [2609\.12999](https://arxiv.org/abs/2609.12999) · [PDF](https://arxiv.org/pdf/2609.12999)
- **分类：** math\.AP、math-ph
- **进展类型：** 谱分解与色散估计
- **阅读优先级：** 86/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究双曲平面上带均匀磁场的 Landau Hamiltonian $H\_B=-y^2\(\\partial\_x-iB/y\)^2-y^2\\partial\_y^2$ 的薛定谔演化。在 $\|B\|&lt;1/2$ 下，作者构造显式传播核表示，证明短时间 $L^1\\to L^\\infty$ 衰减为 $\|t\|^\{-1\}$、长时间衰减为 $\|t\|^\{-3/2\}$，并由此推出更宽 admissible 区域内的 Strichartz 估计。

**使用技术**

- 以 Maass 算子和双曲点对不变量函数 $P^n\_\{s,B\}$、$Q^n\_\{s,B\}$ 建立谱参数化；利用双曲距离渐近、超几何函数和对角线对数奇性构造 resolvent Green 核。
- 沿连续谱线 $s=1/2\+i\\nu$ 使用谱分解与 Stone 公式，结合 $P^0\_\{s,B\}$ 的积分表示及广义 Chebyshev 函数，将传播子化为显式振荡径向积分。
- 对径向积分 $L\_t\(r\)$ 使用双曲函数渐近估计；长时间直接积分并作 $u=\\rho-r$ 变换，短时间在 $\\sqrt\{r^2\+t\}$ 处分割并对尾积分分部积分，再通过变量 $\\cosh\(\\rho/2\)=\\cosh\(r/2\)\\cosh X$ 控制导数。
- 将点态核界转化为双曲径向卷积估计，利用双曲球体积渐近、Lorentz 弱范数、Young 不等式、Kunze--Stein 现象和插值获得广义色散估计，最后用 $TT^\*$ 方法推出 Strichartz 估计。

**可能的突破**

在双曲几何下给出带磁场 Landau Hamiltonian 传播子的显式核公式，并证明连续谱情形的分段时间衰减：短时间为 $\|t\|^\{-1\}$，长时间为双曲几何特有的 $\|t\|^\{-3/2\}$。证明还显示常数在阈值 $\|B\|\\to1/2$ 时至多按 $\(1-2\|B\|\)^\{-2\}$ 发散，并将更快的长时衰减转化为更宽的 Strichartz admissible 区域。

**限制与不确定性**

主要结论限于 $\|B\|&lt;1/2$，此时不存在离散 Landau 能级；$\|B\|&gt;1/2$ 的束缚态及其传播未纳入色散估计。部分谱分解依赖既有结果，Strichartz 推导的 $TT^\*$ 细节被略去。结果针对完整双曲平面和均匀磁场，未处理边界、非均匀磁场或非线性方程应用。

**证明逻辑/大纲**

1. **主张：** 构造 $D\_B$ 的 resolvent 核并识别谱结构。
   - **路线：** 先验证带规范因子的 $Q^0\_\{s,B\}$ 是 $D\_B$ 的本征函数；利用 $r\\to0$ 时的对数奇性与双曲测度确定 Green 分布的 delta 项，再由 $r\\to\\infty$ 的指数衰减证明对应积分算子在 $L^2$ 上有界，从而得到 resolvent。随后分析极点，确认 $\|B\|\\le1/2$ 时无点谱，连续谱从 $B^2\+1/4$ 开始。
2. **主张：** 由连续谱分解得到显式传播核和 Theorem 1\.1。
   - **路线：** 使用 Lemma 3\.2 的谱分解，将连续参数置于 $\\operatorname\{Re\}s=1/2$ 的积分轮廓上；对 $P^0\_\{s,B\}$ 应用积分表示，结合 Stone 公式和变量变换得到式 $\(3\.8\)$--$\(3\.10\)$，再整理为带相位因子、径向积分及 $\\Psi\(\\rho,\\pm B\)$ 的传播核公式。
3. **主张：** 证明径向振荡积分的统一估计 Proposition 4\.1。
   - **路线：** 令 $K\(\\rho,B\)=\\Psi\(\\rho,B\)\+\\Psi\(\\rho,-B\)$。长时间情形用 Lemma 4\.2 的双曲渐近和 $u=\\rho-r$ 变换，把积分化为带 $\\delta=1/2-B$ 的 Gamma 型积分，得到 $\(1\+r\)e^\{-r/2\}$；短时间情形在 $\\sqrt\{r^2\+t\}$ 处分割，近端直接估计，远端利用 $\\rho e^\{i\\rho^2/\(4t\)\}=-2it\\,\\partial\_\\rho e^\{i\\rho^2/\(4t\)\}$ 分部积分，并用式 $\(4\.8\)$ 控制 $K'\(\\rho,B\)$，闭合 $\\sqrt\{\|t\|\}\(1\+r\)^\{1/2\}e^\{-r/2\}$ 界。
4. **主张：** 由核估计推出色散和 Strichartz 结论。
   - **路线：** 将 Proposition 4\.1 的点态界与双曲球体积渐近结合，得到 Lorentz 范数估计 $\(4\.10\)$；再通过 Young、Kunze--Stein 和插值获得 Corollary 4\.3 的 $L^\{\\tilde q'\}\\to L^q$ 界及 Theorem 1\.2 的 $L^1\\to L^\\infty$ 分段衰减，最后应用标准 $TT^\*$ 方法得到所有声明 admissible 对的 Strichartz 估计。

**排序理由**

正文核查显示该文围绕“谱分解与色散估计”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 86/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--17 页全文，包括摘要、引言、Section 2--4、全部定理与证明、参考文献、正文末尾及作者信息，并检索致谢、AI、LLM、ChatGPT、软件、代码、工具、编辑、校对、翻译、排版和图表声明；未发现作者明确披露使用 AI 或相关工具。全文未见独立致谢或其他 AI/工具声明段落。

**原始英文摘要**

In this paper, We obtain dispersive estimates for solutions to the Schr\\"odinger equation with a uniform magnetic field on the hyperbolic plane \\\(\\mathbb\{H\}\\\)\. The key ingredient is an explicit representation formula for the kernel of the corresponding Schr\\"\{o\}dinger propagator\. As a consequence, we prove the corresponding Strichartz estimates for all admissible pairs on \\\(\\mathbb\{H\}\\\)\.

---

### 变分方法

#### Optimal regularity for vectorial, higher order and non-minimizing Bernoulli problems

- **作者：** Guido De Philippis、Jonas Hirsch、Mickaël Nahon
- **arXiv：** [2609\.12180](https://arxiv.org/abs/2609.12180) · [PDF](https://arxiv.org/pdf/2609.12180)
- **分类：** math\.AP
- **进展类型：** 最优正则性与自由边界
- **阅读优先级：** 91/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究广义 Bernoulli 自由边界问题，涵盖向量值、高阶、约束和非极小情形。核心是抽象正则性定理：若函数在每个球上有局部比较函数，且比较误差由零集测度控制、比较函数梯度由偏差控制，则函数在自由边界附近具有最优有界性。作者先用尺度偏差迭代建立 BMO 控制，再以平均值和零集密度的二分迭代升级到局部无穷范数界。随后将该定理应用于高阶椭圆最小化、Stokes 问题、二维标量及满足额外方程约束的向量值驻点解，并处理若干谱几何和形状优化问题。

**使用技术**

- 尺度偏差迭代、BMO 控制与 Campanato 型估计
- 零集密度衰减和二分迭代
- 高阶椭圆系统的能量比较、Garding 不等式与内部正则性
- Hopf 微分、Ahlfors-Beurling 变换和弱型算子估计
- 二维调和共形映射、紧性、Fourier/Laurent 模式分解与反证法
- Caccioppoli 不等式、高阶 Sobolev 嵌入和集中紧性

**可能的突破**

作者给出一个不依赖最大值原理、比较原理或 Alt-Caffarelli-Friedman 单调性公式的抽象最优正则性机制，并将其用于高阶及不满足最大值原理的椭圆算子，包括弹性、双调和和 Stokes 型 Bernoulli 问题。结果覆盖局部极小解的 $W^\{n,\\infty\}$ 正则性、二维驻点解的 Lipschitz 正则性，以及多个谱形状优化问题的最优特征函数正则性。

**限制与不确定性**

抽象定理要求每个球存在满足 \(1\.10\)--\(1\.11\) 的局部比较函数，因此应用范围依赖相应能量比较和内部椭圆估计。非退化性只在 $m=0$ 的高阶最小化问题中得到；当 $m\\ge1$ 或 Stokes 约束下，论文给出反例或明确指出缺少所需的 Caccioppoli 型估计。二维标量驻点结论不能直接推广到一般向量值情形，Theorem 8 需要额外的弱约束 $u\_k\\Delta u\_l=0$。若干形状优化的存在性和集中紧性环节依赖外部文献，最优域的有界性在 Stokes 特征值问题中仍未知。

**证明逻辑/大纲**

1. **主张：** 抽象 Theorem 1 将局部比较性质提升为自由边界附近的点态有界性。
   - **路线：** 令 $\\mathcal\{M\}$ 为满足 \(1\.10\)--\(1\.11\) 的函数族。Lemma 9 由三角不等式、比较函数梯度估计和零集误差给出单尺度偏差递推；Corollary 10 迭代得到小球上的偏差衰减和 BMO 型控制。若平均值相对偏差足够大，Lemma 11 说明缩小一个固定比例后零集密度至少减少四分之一；Lemma 12 继续迭代得到原点零集密度为零。Theorem 1 的证明以 $r=2\\operatorname\{dist\}\(z,F\_\\varphi\)$ 分尺度，先用局部比较函数控制远离自由边界的情形，再反设中间尺度平均值过大，调用 Lemma 12 与 $F\_\\varphi$ 的定义矛盾，最终得到 $\|\\varphi\(z\)\|\\le C\(1\+\\operatorname\{dist\}\(z,F\_\\varphi\)^\\alpha\\\|\\varphi\\\|\_\{L^2\}\)$。
2. **主张：** Theorem 1 适用于高阶向量值最小化问题和受散度约束的 Stokes-Bernoulli 问题。
   - **路线：** 对高阶最小解取 $\\varphi=\\nabla^n u$，在每个球上取同边界数据的纯二次能量最小解 $u\_\{B\_\{z,r\}\}$，以最小性和 Gårding 不等式得到 \(1\.10\)，再由 Lemma 13 的高阶椭圆内部梯度界得到 \(1\.11\)，故 Corollary 2 直接由 Theorem 1 推出。Stokes 情形取 $\\varphi=\\nabla u$，用 Stokes 核表示和 Lemma 15 得到比较解梯度界，再以同样能量比较验证 Theorem 1 的两个假设，从而得到 Corollary 6。Proposition 5 的非退化性则使用缩放、Caccioppoli、不变性和 Sobolev 嵌入建立尺度递减。
3. **主张：** 二维标量驻点解通过 Hopf 微分的局部调和替代满足抽象定理，从而获得 Lipschitz 正则性。
   - **路线：** Lemma 18 将内变分驻点条件等价改写为 Hopf 微分 $H\_u$ 与零集指示函数的弱 Cauchy-Riemann 方程。引入 Ahlfors-Beurling 变换 $B$ 后，在每个球上构造由 $H\_u$ 和 $B\[\\chi\_\{\\\{u=0\\\}\}\]$ 组成的局部比较量；Lemma 20 给出 $L^2$ 等距和弱型 $L^1\\to L^\{1,\\infty\}$ 界，Lemma 21 将调和函数的弱型界升级为内层无穷范数界。Lemma 22 验证比较量满足 \(1\.10\)--\(1\.11\)，应用 Theorem 1 得到 $H\_u\\in L^\\infty\_\{\\mathrm\{loc\}\}$，再由 $\|\\nabla u\|=4\|H\_u\|$ 推出 Corollary 7。
4. **主张：** 满足额外约束的二维向量值驻点解通过调和共形极限和 Laurent 模式排除获得 Lipschitz 界。
   - **路线：** Theorem 24 先将目标化为控制所有缩放解的 $L^2$ 范数。Lemma 25 利用 $\\Delta\(\|u\|^2-2\(u\\cdot e\)^2\)\\ge-8\|H\_u\|$ 建立 Hölder 控制和能量增长估计。对范数趋于无穷的归一化序列，Lemma 26 通过 Arzela-Ascoli 紧性得到在支集上调和且共形的极限。Lemmas 28--30 将大解分成接近线性共形映射或在缩放下严格衰减的情形；Lemma 31 展开环域上的调和解，Lemma 32 控制低阶奇异系数，Lemma 33 以先前的温和衰减排除 $r^\{-\|n\|\}e^\{in\\theta\}$ 与 $\\log r$ 等奇异模式。Theorem 24 的三分支迭代因此给出缩放能量界，再结合 Lemma 22 得到 Theorem 8。
5. **主张：** 抽象正则性定理还推出谱特征值、Stokes 特征值及内变分形状优化问题的正则性结论。
   - **路线：** 对高阶谱商问题，作者先用集中紧性获得最优域和特征函数，再在小球中引入带低阶项的局部比较解，通过 \(5\.2\) 的强椭圆性和能量比较得到 \(1\.10\)，内部估计给出 \(1\.11\)，故 Theorem 1 导出 Proposition 37 的 $W^\{n,\\infty\}$ 正则性。Stokes 特征值问题以相同方式处理，但因缺少非退化性不能断言最优域有界。对于内变分问题，Proposition 39 把一阶变分改写为 Hopf 微分方程，利用 Beurling 变换构造局部调和比较量，再调用 Theorem 1 得到局部 $W^\{1,\\infty\}$。

**排序理由**

正文核查显示该文围绕“最优正则性与自由边界”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 91/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已检查官方 arXiv PDF 第 1--37 页，重点核查第 34 页 Acknowledgment、第 30--34 页正文末尾与 References，以及全文中的 AI、LLM、ChatGPT、GPT、OpenAI、artificial intelligence、language model、software、code 和工具声明相关表述；未发现明确披露。

**原始英文摘要**

We prove the Lipschitz regularity of solutions for a wide class of generalized Bernoulli free boundary problems, in vectorial, higher order, and non-minimizing settings\. Our method does not rely on notions of viscosity solutions or comparison methods, which allows us to reach the optimal regularity for Bernoulli-type problems associated to elliptic operators which do not satisfy any maximum principle, namely the elasticity, biharmonic and Stokes equation\. With a similar method we obtain the optimal Lipschitz regularity for stationary, non-minimizing solutions of the standard Bernoulli problem in two dimensions\.

---

#### The sharp $\\sigma\_k$-curvature inequality on locally conformally flat manifolds in quantitative form

- **作者：** Jonas W\. Peteranderl
- **arXiv：** [2609\.13133](https://arxiv.org/abs/2609.13133) · [PDF](https://arxiv.org/pdf/2609.13133)
- **分类：** math\.DG、math\.AP、math\.FA
- **进展类型：** 局部共形平坦流形上的定量高阶曲率稳定性
- **阅读优先级：** 91/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--30 页。论文在闭、连通、局部共形平坦且含 $k$-可容许度量的流形上，假设极小化子集非退化，证明归一化总 $\\sigma\_k$-曲率泛函的亏损定量控制到极小化子集的距离，控制项为 $W^\{1,2\}$ 距离的平方与 $W^\{1,2k\}$ 距离的 $2k$ 次方。证明先建立 Newton 张量给出的全局二阶强制性，再用共形 Hessian 的频率分裂完成局部稳定性，最后借助 Guan--Wang 流把一般近极小元送入局部邻域，并在球面上构造测试族证明两个指数最优。

**使用技术**

- $\\sigma\_k$-曲率泛函、Schouten 张量与 Gårding 锥 $\\Gamma\_k^\+$
- 共形因子参数化、共形 Hessian 的谱分解、零模态去除与非退化性
- Newton 张量超可加性、共形仿射插值与二阶变分强制性
- 乘法分解 $u=\(1\+y\)\(1\+z\)v$、隐函数定理与中高频分裂
- Harnack 估计、Sobolev 嵌入、谱隙吸收与局部稳定性
- Guan--Wang 对数流、平稳近极小元紧性与全局到局部约化
- 球面上的尖锐性测试族与 $W^\{1,2\}$、$W^\{1,2k\}$ 指数最优性

**可能的突破**

核心进展是对 $2\\le k&lt;n/2$ 的局部共形平坦流形给出定量的 $\\sigma\_k$-曲率稳定性不等式：曲率亏损以统一常数控制到所有归一化极小化子、共形对称和尺度的距离，其中二次 $W^\{1,2\}$ 项与 $2k$ 次 $W^\{1,2k\}$ 项同时出现。局部部分通过非退化 Hessian 的低频谱隙、Newton 张量超可加性产生的高频 coercivity 以及乘法分解隔离混合项；全局部分以 Guan--Wang 流将近极小元推进到局部区域，并由球面双参数测试族证明两个指数的尖锐性。

**限制与不确定性**

结果要求流形闭、连通且局部共形平坦，存在 $k$-可容许背景度量，并要求极小化子集满足非退化的有限维光滑结构；不覆盖一般非局部共形平坦流形、退化极小化子、$k=1$、$k\\ge n/2$ 或仅属于 $\\Gamma\_\{k-1\}^\+$ 的情形。全局到局部步骤依赖平稳近极小元的非构造性紧性和既有 Guan--Wang、Li--Li 理论，作者明确未给出具有显式维数控制的稳定常数。指数最优性只在圆球及特定测试族上验证，不能直接推出所有流形上的常数或更细的误差展开；论文也未处理非光滑因子、边界流形、离散数值误差或退化情形下的稳定性。

**证明逻辑/大纲**

1. **主张：** 建立极小化子紧性、距离结构和全局二阶强制性。
   - **路线：** 先用平稳常曲率近极小元的紧性得到极小化子存在及对称作用下的收敛，再定义同时包含尺度、共形微分同胚和极小化子的距离。对共形因子的仿射插值，利用 Newton 张量的超可加性将二阶变分下界分解为梯度的平方项和 $2k$ 次梯度项；一维参数积分估计闭合全局强制性。
2. **主张：** 在极小化子邻域内构造乘法频率分解并分离亏损。
   - **路线：** 以非退化共形 Hessian 的核、低频和高频谱子空间为坐标，通过隐函数定理写成 $\(u\)\_\\Psi=c\(1\+y\)\(1\+z\)v$，其中 $z$ 为中频项、$y$ 为高频项。归一化中间度量后把亏损拆成中频二次项、高频余项和混合一阶项；正交谱子空间使混合项具有更高阶，而 Newton 张量二阶强制性、Harnack 下界和谱隙分别控制高频各项。
3. **主张：** 闭合 Proposition 2 的局部定量稳定性估计。
   - **路线：** 将中频 Taylor 展开、高频估计和可吸收的混合项合并，得到亏损控制 $y$ 与 $z$ 的 $W^\{1,2\}$ 平方和 $W^\{1,2k\}$ 的 $2k$ 次方；再展开 $\(1\+y\)\(1\+z\)-1=y\+z\+yz$，利用有限维范数等价与乘积估计把这些项上界为定义的距离，从而得到局部亏损下界。
4. **主张：** 通过 Guan--Wang 流把局部估计提升为全局稳定性。
   - **路线：** 从任意归一化近极小元出发运行对数 Guan--Wang 流，利用全局存在、可容许性与体积保持、能量单调下降以及时间子列收敛到平稳近极小元，先把距离推进到局部阈值。定义首次进入时间，单调性把初始亏损下界为入口处亏损，再结合局部 Proposition 2 和距离的统一上界得到 Proposition 16；最后按亏损是否小于阈值分情形并用尺度归一化证明 Theorem 1。
5. **主张：** 证明稳定性指数在圆球上不可改进。
   - **路线：** 在圆球上取与常数模态和共形对称模态正交的固定扰动，归一化后曲率亏损和 $W^\{1,2\}$ 距离平方都渐近于扰动幅度的平方。再取沿共形变换集中化的双参数测试族，验证 $k$-可容许性并比较两个剖面的分离尺度，得到曲率亏损和 $W^\{1,2k\}$ 距离的 $2k$ 次方同阶。

**排序理由**

正文核查显示该文围绕“局部共形平坦流形上的定量高阶曲率稳定性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 91/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：论文 PDF 全文逐页核查（第 1--30 页），重点包括正文末尾第 27--30 页的 Section 5、Acknowledgement 和 References，以及全文关键词检索；未见 AI、LLM 或相关工具使用声明。

**原始英文摘要**

Let $2\\leq k&lt;n/2$ and let $\(M^n,\[g\_0\]\)$ be a closed, connected, and locally conformally flat Riemannian manifold with a $k$-admissible metric in the conformal class $\[g\_0\]$\. We prove a stability result of the $\\sigma\_k$-curvature inequality on $M$, in the sense that if equality is almost satisfied for some conformal metric, then this metric is close to a minimizer of the inequality\. Closeness is measured quantitatively in terms of Sobolev norms of the conformal factor, namely with respect to the $W^\{1,2\}$- and the $W^\{1,2k\}$-norm with optimal exponents $2$ and $2k$, respectively\. This extends a previous result by Frank and the author to $2&lt;k&lt;n/2$ and, under an additional non-degeneracy assumption, to the full class of manifolds originally considered by Viaclovsky\.

---

#### Non-radial minimizers for the first eigenvalue of the Laplacian in cones and a related overdetermined problem

- **作者：** Danilo Gregorin Afonso
- **arXiv：** [2609\.12879](https://arxiv.org/abs/2609.12879) · [PDF](https://arxiv.org/pdf/2609.12879)
- **分类：** math\.AP
- **进展类型：** 稳定性分析与非径向极小集存在性
- **阅读优先级：** 85/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究圆锥域中带混合边界条件的第一拉普拉斯特征值，在固定体积下的极小集及相关超定问题。作者通过形状导数、集中紧性和自由边界正则性，证明某些非凸圆锥中存在有界、连通、非径向的极小集，并得到相应的非径向超定解。

**使用技术**

- 极坐标图形下的一阶与二阶形状导数
- 球面 Laplace--Beltrami 算子的谱分解
- 集中紧性分析与无穷远处圆锥扁平化
- 尺度不变的体积惩罚泛函
- 形状子解与自由边界正则性
- 局部形变和 Hadamard 公式

**可能的突破**

定理 3\.16 证明球形扇区的稳定性阈值由球面区域上的首个非零 Neumann 特征值 $\\mu\_1$ 与 $N-1$ 的比较决定：$\\mu\_1&lt;N-1$ 时不稳定，$\\mu\_1&gt;N-1$ 时稳定。定理 4\.6 和命题 4\.7 在相对于半空间的严格特征值优势下建立固定体积极小集的存在性。结合定理 6\.1 和定理 6\.4，作者得到边界几乎处处解析且满足非零常法向导数的非径向超定解。

**限制与不确定性**

存在性依赖严格条件 $\\lambda\(\\Sigma\_D,m\)&lt;\\lambda\(\\Sigma^\+\_\{\\mathbb S^\{N-1\}\},m\)$；论文没有解决临界情形 $\\mu\_1=N-1$，也没有证明极小集唯一性。自由边界结论主要是几乎处处意义或弱意义，奇异部分未完全分类。二维情形的圆锥开角存在稳定性与存在性条件冲突，论文只作讨论而未给出一般结论。

**证明逻辑/大纲**

1. **主张：** 定理 3\.16 建立球形扇区稳定性与球面 Neumann 特征值的阈值判据。
   - **路线：** 先在极坐标图形类中计算特征值的一阶和二阶形状导数，再将变分方向展开为球面 Laplace--Beltrami 算子的 Neumann 特征函数。对每个模态建立径向 Sturm--Liouville 方程，通过分部积分比较径向导数；当 $\\mu\_1&lt;N-1$ 时构造负二阶方向，当 $\\mu\_1&gt;N-1$ 时逐模态得到正下界。
2. **主张：** 定理 4\.6 证明严格低于半空间基准时固定体积极小值可以达到。
   - **路线：** 先用圆锥的尺度不变性和边界在无穷远处的扁平化构造半球测试集，得到命题 4\.4 的上界。对极小序列应用集中紧性，将可能性分为紧性、消失和二分；严格不等式排除消失与二分，紧性则给出弱极限。利用下半连续性和尺度调整恢复体积约束，完成极小性。
3. **主张：** 第 5 节把抽象的 quasi-open 极小集提升为有界、开放、连通并具有几乎处处解析自由边界的集合。
   - **路线：** 通过尺度等价将固定体积问题改写为带体积惩罚的泛函；先证明极小集是能量形状子解，再借助截断测试函数和周长估计得到有界性。随后利用局部 Lipschitz 估计证明开放性，利用连通分支缩放排除不连通情形，最后应用自由边界理论得到约束分布方程和约化边界的解析性。
4. **主张：** 定理 6\.1 和定理 6\.4 将极小性转化为超定边界条件并产生非径向解。
   - **路线：** 在自由边界正则点附近选取紧支撑法向流，利用特征函数的可微依赖和 Hadamard 公式计算特征值与体积导数。对尺度不变泛函的局部极小性使边界上的 $\|\\nabla u\|^2$ 等于常数，从而得到 $\\partial\_\\nu u=-\\sqrt\{2\\lambda\_1\(\\Omega\)/\(N\|\\Omega\|\)\}$。再结合前述存在性和不稳定性，排除径向情形并得到非径向超定域。

**排序理由**

正文核查显示该文围绕“稳定性分析与非径向极小集存在性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 85/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 正文、摘要、各节末尾、References 前的 Acknowledgements、Data Availability、Declarations 及文末声明区域。Acknowledgements 仅说明 GNAMPA 与 INdAM 的资助；未发现作者披露使用 AI、LLM 或相关工具参与研究、证明、写作、代码、编辑、校对、翻译、排版、图表或插图。

**原始英文摘要**

In this work, we consider relative overdetermined problems for the first eigenfunction of the Laplacian for domains in cones, and the related question of minimizing the first eigenvalue among sets of a given fixed measure\. By means of a shape derivative analysis, we show that the spherical sector is a critical shape and obtain a geometric condition on the cone for its stability/instability\. By a concentration-compactness argument, we prove the existence of a minimizer, which moreover is bounded, open, connected, and whose relative boundary is regular almost everywhere\. By another domain variation argument, we conclude that the minimizers admit a solution for the overdetermined problem\.

---

### 流体方程

#### Regularity theory and low Mach number limit for the fractional Euler-alignment system

- **作者：** Young-Pil Choi、Jinwook Jung
- **arXiv：** [2609\.12429](https://arxiv.org/abs/2609.12429) · [PDF](https://arxiv.org/pdf/2609.12429)
- **分类：** math\.AP
- **进展类型：** 低马赫数极限与全局强适定性
- **阅读优先级：** 91/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

研究带压力和超奇异分数阶对齐作用的可压缩 Euler--alignment 系统。作者建立与小参数 $\\varepsilon$ 一致的正则性估计、全局小数据强解，并证明低马赫数极限。低阶区间 $0&lt;\\alpha\\le 1/2$ 的闭合正则性阈值为 $s&gt;d/2\+1-2\\alpha$，高阶区间 $1/2&lt;\\alpha&lt;1$ 的阈值为 $s&gt;d/2$。

**使用技术**

- 将密度写为 $\\rho=1\+h$，利用压力项产生的密度耗散和分数阶乘积、交换子估计。
- 在低阶区间使用 Fourier 插值估计控制 $\\nabla h$ 的 $H^\{s\+\\alpha-1\}$ 范数，在高阶区间控制 $H^\{s-\\alpha\}$ 范数。
- 通过 Leray 分解 $u^\\varepsilon=Pu^\\varepsilon\+Qu^\\varepsilon$，对梯度分量建立快速声学系统，并使用频率局部化的波 Strichartz 衰减。
- 对无散部分使用投影方程、Aubin--Lions 紧性和局部强收敛；对充分准备数据使用相对能量与 Grönwall 不等式。

**可能的突破**

作者宣称首次处理带压力、超奇异分数阶对齐的低马赫数极限。统一估计在 $0&lt;\\alpha\\le1/2$ 时借助压力诱导的密度耗散，把闭合阈值推进到 $s&gt;d/2\+1-2\\alpha$，相对于直接估计获得 $\\alpha$ 阶正则性收益；一般小数据得到声学分量局部时空衰减和分布意义下的分数阶不可压缩 Navier--Stokes 极限，充分准备数据则得到全局强收敛。

**限制与不确定性**

无准备数据情形只得到抽 subsequence 的局部时空强收敛，极限仅保证为分布意义解，未给出该极限方程的一般唯一性。充分准备数据情形要求存在满足梯度、压力和分数阶耗散正则性的预先给定不可压缩解，并假设初始相对能量趋于零。结果依赖小数据条件、全空间局部紧性和 $\\varepsilon$ 一致 Sobolev 控制。

**证明逻辑/大纲**

1. **主张：** 建立两种分数阶区间的 $\\varepsilon$ 一致先验能量估计。
   - **路线：** 在低阶情形把压力贡献转化为 $\\varepsilon^\{-2\}\\\|\\nabla h\\\|\_\{H^\{s\+\\alpha-1\}\}^2$，用 Fourier 插值和交换子估计吸收对齐及输运非线性；高阶情形改用 $\\varepsilon^\{-2\}\\\|\\nabla h\\\|\_\{H^\{s-\\alpha\}\}^2$，两者共同闭合速度的 $H^s$ 能量和 $\\\|\\Lambda^\\alpha u\\\|\_\{H^s\}$ 耗散。
2. **主张：** 从局部强解延拓到全局小数据强解。
   - **路线：** 以平滑逼近构造局部解，使用相对能量稳定性控制差分唯一性；定义 bootstrap 时间，将 Proposition 2\.1 或 3\.1 的估计写成 \(4\.11\)，改善小性假设并保持密度落在 $\[1/2,3/2\]$，从而排除有限最大存在时间。
3. **主张：** 无准备数据下声学梯度分量局部消失，并获得不可压缩极限的紧性。
   - **路线：** 令 $a^\\varepsilon=\\sqrt\{\\gamma\}\(\\rho^\\varepsilon-1\)/\\varepsilon$、$w^\\varepsilon=Qu^\\varepsilon$，将其化为快速声学系统；Lemma 5\.1 结合频率局部化 Strichartz 估计 \(5\.2\) 使中频部分趋于零，再用低、高频 Bernstein 控制去掉截断。对 $Pu^\\varepsilon$ 的时间导数作负阶估计，应用 Aubin--Lions 得到局部强收敛，并以弱形式传递输运和对齐项。
4. **主张：** 充分准备数据下相对能量收敛到给定的分数阶不可压缩解。
   - **路线：** 定义包含动能差和压力势的相对能量 $\\mathcal H^\\varepsilon$，由系统方程与不可压缩方程相减得到耗散恒等式；用 $\\\|\\rho^\\varepsilon-1\\\|\_\{H^\{d/2\+\\delta\_0\}\}\\le C\\varepsilon$、分数阶乘积估计和 Young 不等式控制对流、对齐及压力误差，时间积分后用 Grönwall 闭合，使 $\\sup\_t\\mathcal H^\\varepsilon\(t\)\\to0$ 并得到 $L^2\_t\\dot H^\\alpha\_x$ 强收敛。

**排序理由**

正文核查显示该文围绕“低马赫数极限与全局强适定性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 91/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 正文第 1--39 页、正文末尾的 Acknowledgments 第 39 页以及 References 第 40--41 页，并检索 AI、LLM、ChatGPT、GPT、OpenAI、software、code、tool、proofread、translate、typeset 等披露词；未见相关声明。

**原始英文摘要**

We study the compressible Euler-alignment system with pressure under a singular pressure scaling, where the hypersingular communication weight induces a fractional alignment operator of order $2\\alpha$, $0&lt;\\alpha&lt;1$\. The scaling corresponds to a large-time and small-velocity regime and leads to a low Mach number problem in which the density is forced to remain close to a constant state\. Our main result is a uniform regularity theory for this scaled pressure system\. We establish uniform estimates with respect to the scaling parameter and construct global strong solutions near the constant state\. A key feature of the analysis is that, in the low-order fractional regime $0&lt;\\alpha\\le\\frac12$, the estimates close under the lower Sobolev condition $s&gt;\\frac d2\+1-2\\alpha$, gaining $\\alpha$ derivatives over the threshold $s&gt;\\frac d2 \+ 1 - \\alpha$ arising from a direct use of the fractional alignment dissipation\. This is achieved by combining refined commutator estimates for the singular alignment operator with the density dissipation induced by the pressure scaling\. As an application of the uniform estimates, we justify the low Mach number limit toward the incompressible Navier--Stokes system with fractional dissipation\. For general small, possibly ill-prepared initial data, a Helmholtz decomposition combined with dispersive estimates for the acoustic component yields subsequential strong convergence locally in space-time to a distributional solution of the limiting system\. For well-prepared initial data, a relative-energy argument further identifies the limit with a prescribed sufficiently regular solution and yields global strong convergence in the fractional dissipation norm\.

---

#### Eigenvalues of the linearized Navier-Stokes operator near locally Couette laminar flows

- **作者：** Yaniv Almog、Bernard Helffer
- **arXiv：** [2609\.12029](https://arxiv.org/abs/2609.12029) · [PDF](https://arxiv.org/pdf/2609.12029)
- **分类：** math\.AP、math-ph
- **进展类型：** 定理证明已核查
- **阅读优先级：** 90/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

正文全文可得并已核查 PDF 第 1–49 页。论文在局部 Couette 型单调层流假设下，把线性化 Navier–Stokes 谱问题化为 Orr–Sommerfeld 算子，证明存在特征值满足 $\|\\lambda-\\lambda\_0\(\\beta\)-iU\(-1\)\|\\le\\beta^\{-1/2\+\\varepsilon\}$；其证明由 Airy 边界层准模、分区 resolvent 估计、无滑移 Schrödinger 匹配和围道积分闭合。

**使用技术**

- 流函数与 Fourier 模态约化到 Orr–Sommerfeld 方程
- Airy 函数原函数零点与边界层准模
- Hardy 不等式及 Dirichlet Schrödinger resolvent 估计
- 左右 Airy 解、整线 Schrödinger 逆与无滑移积分条件匹配
- 边界层递推、外域估计与 Cauchy 围道积分

**可能的突破**

核心进展是把 Wasow 对 Couette 流的形式边界特征值转为一般局部 Couette 单调流的严格存在结论：Airy 模型的左端本征函数经截断形成准模，边界层与外域估计把误差压入 resolvent 界，最终用全纯依赖和 Cauchy 围道积分证明算子核非平凡。

**限制与不确定性**

仅在 $U\\in C^4\(\[-1,1\]\)$、端点单调下界、$\\beta$ 足够大且 $\\alpha$ 有界的二维无限通道设置中给出存在性与 leading-order 邻近界；不提供该特征值的唯一性、完整谱刻画、非线性稳定性或更高阶渐近。证明还依赖若干先前 Schrödinger resolvent 结果，并将附录数值零点研究作为说明而非证明。

**证明逻辑/大纲**

1. **主张：** 线性化 Navier–Stokes 的 Fourier 模态谱问题等价于 Orr–Sommerfeld 算子的核问题，且目标位置由线性 Couette 半轴模型的 Airy 原函数零点给出。
   - **路线：** 对不可压线性化方程取流函数并作 Fourier 模态，把投影 resolvent 转成 $B^D\_\{\\lambda,\\alpha,\\beta\}\\varphi=f$；令 $v=-\\varphi\\prime\\prime\+\\alpha^2\\varphi$ 后，线性势模型 $L\_\{0,\\beta\}$ 的谱由 $A\_0\(i\\lambda\)$ 的零点刻画，尺度变换给出 $\\lambda\_0\(\\beta\)=\\beta^\{-1/3\}\\lambda\_0\(1\)$。因此证明可归结为在目标邻域构造 $\\ker B^D\_\{\\lambda,\\alpha,\\beta\}\\ne\\\{0\\\}$。
2. **主张：** Airy 左端边界层本征函数可生成满足无滑移边界的准模，并且残差相对于二阶椭圆量足够小。
   - **路线：** 先用平移和斜率缩放归一化 $U\(-1\)=0$、$U\\prime\(-1\)=1$，以 $\\check\{\\psi\}\_-$ 的 Airy 表达式 \(2\.9a\) 取 $v\_0=\\check\{\\psi\}\_-\(\\cdot,\\lambda\_0\(\\beta\)\)$；由局部化估计 \(2\.19\)–\(2\.22\) 得到 $\\\|v\_0\\\|\_2\\asymp\\beta^\{-1/6\}$，再解 $-\\widehat\{\\varphi\}\_0\\prime\\prime=v\_0$ 并用截断 $\\widetilde\{\\varphi\}=\\eta\\widehat\{\\varphi\}\_0$ 强制两端无滑移。对截断、$U-\(1\+x\)$、二阶流速项和 $\\alpha^2$ 误差分别估计，得到 $\\\|B^D\_\{\\lambda\_0,\\alpha,\\beta\}\\widetilde\{\\varphi\}\\\|\_2\\le C\\beta^\{1/3\}$，并满足 \(2\.2\) 的相对残差条件。
3. **主张：** Hardy 型控制、半轴 Airy resolvent 及空间分区把目标邻域之外的逆算子估计闭合。
   - **路线：** 先由 Hardy 不等式把 $U-U\(-1\)$ 的加权导数控制转成函数控制；Lemma 3\.3 在外侧区间给出 Dirichlet 逆的能量界，Lemma 3\.4 先在半轴模型建立 $L^2$ 与 $L^\\infty\\to L^2$ resolvent 界，再用平移缩放得到 Corollary 3\.5。对边界截断和外侧区间拼接后，Lemma 3\.6 的 \(3\.22\)–\(3\.23\) 同时控制函数、导数及 $L^1$ 范数，为后续边界层和外域吸收提供尺度。
4. **主张：** 无滑移 Schrödinger 问题在 $\\lambda\_0\(\\beta\)$ 附近具有可控的左右边界层表示，并给出带 $\|\\lambda-\\lambda\_0\(\\beta\)\|^\{-1\}$ 的局部 resolvent 界。
   - **路线：** Lemma 4\.1 排除半轴本征值为实数及归一化 Airy 本征函数在边界消失；Lemma 4\.2 与 Corollary 4\.3 用 Airy 展开和变形积分证明积分条件对 $\\lambda-\\widetilde\{\\lambda\}\_0$ 线性消失。Lemma 4\.4 将解写成 $v=A\_\+\(\\psi\_\+-\\widetilde v\_\+\)\+A\_-\(\\psi\_--\\widetilde v\_-\)\+u$，通过两条无滑移积分条件的二乘二系统 \(4\.36\) 求系数，再以 \(4\.20\)、\(4\.30\) 等估计得到 \(4\.13\)–\(4\.16\)。
5. **主张：** 边界层、外域和围道积分三者最终闭合，迫使目标圆盘内出现 Orr–Sommerfeld 特征值。
   - **路线：** Lemma 5\.1 以 $\\delta\(\\beta\)=\\beta^\{-s\}$ 和递推量 $I\_k$ 把边界层误差压缩为 $\\varepsilon\(\\beta\)^k I\_k$，Lemma 5\.2 控制接口值；Lemma 5\.3 与 Proposition 5\.4 通过仿射变换把外域 resolvent 控制到 $O\(\\beta^\{-1\}\)$。Lemma 5\.5–5\.7 再给出全局无穷范数、端点值和二阶导数的逆算子界。最后在 \(5\.79\) 选取 $\\rho$，把准模代入 $\\partial B\(\\lambda\_0,\\rho\)$ 的 Cauchy 积分；\(2\.46\) 给出残差上界，而 $\\\|\\widetilde v\\\|\_2\\gtrsim\\beta^\{-1/6\}$ 给出主项下界，故积分不为零，从而 $B^D\_\{\\lambda,\\alpha,\\beta\}$ 在圆盘内有非平凡核并得到 Theorem 1\.1。

**排序理由**

正文核查显示该文围绕“定理证明已核查”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 90/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：论文 PDF 全文（第 1–49 页），重点包括 Section 1–5 主证明、Acknowledgements、数据共享声明、Appendix A 与 References（PDF 第 46–49 页）。

**原始英文摘要**

We consider the spectrum of the Orr-Sommerfeld operator, which is obtained from the linearized Navier-Stokes \(LNS\) operator near a laminar flow in an infinite two-dimensional channel in the large Reynolds number limit\. For a rather general class of laminar flows, which behave locally near the boundary like a Couette flow and are bounded from below \(above\) by a linear increasing \(decreasing\) function, we show that there exists an eigenvalue of the LNS operator which coincides, to leading order, with the eigenvalue of LNS near Couette flow, which was formally obtained by Wasow in 1953\.

---

#### Multiphasic formulation of Vlasov equations and applications

- **作者：** Aymeric Baradat、Lucas Ertzbischoff、Daniel Han-Kwan
- **arXiv：** [2609\.12659](https://arxiv.org/abs/2609.12659) · [PDF](https://arxiv.org/pdf/2609.12659)
- **分类：** math\.AP
- **进展类型：** 多相 Vlasov 统一理论与应用
- **阅读优先级：** 90/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

构建多相 formulation，将无碰撞 Vlasov 方程改写为耦合的无压 Euler 系统。核心结果是在力场相对于速度矩获得一阶空间正则性增益的条件下，建立有限正则性 Sobolev 局部适定性、稳定性和爆破判据，并将其系统应用于 Vlasov--Poisson、Vlasov--Navier--Stokes 及相关模型。论文还处理粗糙速度分布、Schrödinger--Poisson 半经典极限、Penrose 不稳定性和单动量平衡态的长时间稳定性。

**使用技术**

- 把标签空间 $\(I,\\mu\)$ 上的密度--速度族作为基本未知量，通过积分速度矩恢复相空间测度解。
- 抽出只含速度族的抽象输运方程，以高正则性估计构造映射，以低正则性稳定估计在完备度量空间中做压缩映射。
- 对连续性方程使用 Sobolev、加权 Sobolev 和 Besov 估计，并通过特征线和相空间分布的推前证明多相与 kinetic formulation 的等价性。
- 在 Vlasov--Poisson 中结合 WKB 相位、相对稳定性和 Grenier 型线性到非线性方法，处理半经典极限与粗糙均匀平衡的不稳定性。
- 在 Vlasov--Navier--Stokes 中利用守恒律、线性化谱隙、精细能量估计、bootstrap 和指数衰减证明小扰动全局稳定。

**可能的突破**

统一框架允许初始分布在速度变量上仅为测度，仍保留空间有限正则性和矩的适定性。抽象定理 2\.1\.10 同时给出局部存在、唯一性、稳定性、时间正则性和爆破判据；其应用给出低速度正则性 Vlasov--Poisson 解、粗糙 WKB 数据的 Schrödinger--Poisson 半经典收敛，以及围绕满足 Penrose 条件的测度型均匀平衡的非线性不稳定性。对周期三维多相 Vlasov--Navier--Stokes，作者进一步证明靠近常值单动量平衡态的全局解、速度向守恒总动量确定的常向量指数收敛，以及密度向平移的渐近剖面收敛。

**限制与不确定性**

抽象适定性要求力场相对于相关密度矩至少获得一阶空间正则性；力场与矩同阶或损失导数的情形不由主定理覆盖。抽象结果主要是局部时间的，高阶全局结论依赖具体模型、周期域和小扰动结构。Vlasov--Poisson 不稳定性要求周期域上的 Penrose 谱不稳定条件；论文没有解决稳定平衡、Landau damping 或一般长时间稳定性。Vlasov--Navier--Stokes 的指数衰减依赖周期谱隙，非线性额外阻力情形还要求标签积分指数取无穷，且全局正则性阈值并非最优。

**证明逻辑/大纲**

1. **主张：** 建立多相表示与 kinetic formulation 之间的双向等价。
   - **路线：** 先把标签族 $\(\\rho^\\alpha,v^\\alpha\)$ 映射为相空间 Radon 测度，再通过速度矩恢复连续性方程和速度方程；无耦合情形用特征线给出唯一性，耦合情形利用多相解的唯一性反推 kinetic 解，形成存在性和唯一性的双向传递。
2. **主张：** 在抽象力场假设 A1--A2 下证明有限正则性局部适定性。
   - **路线：** 对给定试探速度解解线性输运方程，利用高阶 Sobolev 能量估计得到映射的统一高正则性界；对两次迭代作差并用低阶稳定性估计和 Grönwall 得到压缩性；Banach 不动点给出解，随后由逐标签能量估计恢复时间连续性、稳定性和爆破判据。
3. **主张：** 将抽象理论应用到 Vlasov--Poisson，并闭合半经典极限与粗糙平衡不稳定性。
   - **路线：** 对 Poisson 力场验证密度矩到力场的一阶正则性增益，得到低空间正则性的局部唯一弱解；对 WKB 初值把 Schrödinger--Poisson 写成振幅和相位的多相系统，用稳定性估计令振幅与相位梯度收敛到多相 Vlasov--Poisson 解；在线性不稳定模态上施加小振幅并控制非线性余项，使其在 $O\(\|\\log\\delta\|\)$ 时间内放大到负 Sobolev 范数可见的量级。
4. **主张：** 证明多相及 kinetic Vlasov--Navier--Stokes 在常值单动量平衡附近的全局稳定和指数衰减。
   - **路线：** 先由局部适定性得到解，再围绕 $\(\\rho^\\alpha,v^\\alpha,U\)=\(1,V,V\)$ 线性化；守恒律确定渐近总动量，谱隙给出梯度和相对速度的线性指数衰减；精细高阶能量估计控制非线性项，bootstrap 延拓全局时间，最后沿特征线把速度衰减转化为 Wasserstein 意义下密度向平移剖面的收敛。可压缩情形额外用流体密度方程和耦合耗散补偿声学项。

**排序理由**

正文核查显示该文围绕“多相 Vlasov 统一理论与应用”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 90/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 全文，包括 Abstract、Preface、正文第 1--282 页、末尾 Bibliography 第 283--304 页及所有章节末尾内容；检索 artificial intelligence、AI、LLM、ChatGPT、GPT、OpenAI、software、code、proofread、translate、typeset、illustration、Acknowledgements 等相关披露词，未见作者 AI/工具声明。

**原始英文摘要**

This work is a mathematical study of the multiphasic formulation of the Vlasov equation, which consists in recasting this collisionless kinetic equation as a system of coupled pressureless Euler equations\. This framework allows to consider solutions that are only measure-valued in the velocity variable and is thus relevant to tackle physical problems where rough velocity distributions, such as Dirac masses, naturally arise\. We specifically address the case of nonlinear Vlasov equations where the force field is one derivative more regular than some moments in velocity of the solution\. Under this key assumption, a unified theory of local well-posedness at finite regularity \(typically in Sobolev spaces\) is developed from scratch for the multiphasic formulation, yielding corresponding results for the Cauchy problem of the associated Vlasov equation at low regularity\. We thoroughly apply this abstract theory to two classes of equations, namely Vlasov-Poisson type systems, and Vlasov-Navier-Stokes type systems\. In addition to the justification of the monokinetic limit, it also leads to specific applications for each class of equations, allowing possibly rough velocity distributions\. For Vlasov-Poisson type systems, we justify the semiclassical limit from Hartree equations, and we describe the nonlinear instability of homogeneous equilibria\. For Vlasov-Navier-Stokes type systems, we establish nonlinear asymptotic stability near monokinetic profiles\. New results allowing a separation between the regularity in space and in velocity are proven, and along the way, we also provide new proofs of known results and generalize them to the case of rough solutions\. Finally, the flexibility of the framework is exploited to obtain extensions to more sophisticated systems such as the Vlasov-Poisson equation for ions, or the Vlasov equation coupled with the compressible Navier-Stokes system\.

---

#### Low Mach number limit of the compressible Euler--Vlasov--Fokker--Planck system in the whole space

- **作者：** Fucai Li、Jinkai Ni、Zhipeng Zhang
- **arXiv：** [2609\.12648](https://arxiv.org/abs/2609.12648) · [PDF](https://arxiv.org/pdf/2609.12648)
- **分类：** math\.AP
- **进展类型：** 低马赫数极限与全局误差收敛
- **阅读优先级：** 89/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--34 页。论文研究全空间中的可压缩 Euler--Vlasov--Fokker--Planck 系统，在近平衡 Maxwell 分布的小初值和适定准备数据下，建立关于 Mach 数 $\\varepsilon$ 一致的全局强解估计，证明全局 $H^2$ 误差为 $O\(\\varepsilon\)$，并识别不可压缩 Euler--VFP 极限及其强收敛。

**使用技术**

- 宏观--微观分解与 Fokker--Planck 算子耗散
- 对称化高阶能量估计与流体--粒子松弛阻尼
- Helmholtz 投影、阻尼半群表示与负 Sobolev 压力估计
- 修正声学变量与奇异声学项精确消去
- 误差能量闭合、强收敛与分布意义极限识别

**可能的突破**

核心进展是对全空间可压缩 Euler--VFP 系统给出低马赫数极限的全局定量证明：在小的 $H^3$ 初值下获得独立于 $\\varepsilon$ 和时间的全局先验估计；对充分准备的初值引入修正声学变量 $\\delta q=q^\\varepsilon-\\varepsilon\[P'\(1\)\]^\{-1\}\\pi$，消去主阶压力贡献并闭合全局 $H^2$ 误差估计，得到速率 $O\(\\varepsilon\)$；随后证明密度扰动消失、速度和粒子分布强收敛，并在分布意义下识别不可压缩极限方程。

**限制与不确定性**

结果限定于全空间 $\\mathbb\{R\}^3$、等熵模型、近平衡 Maxwell 分布的小初值和充分准备的初始数据；Theorem 1\.2 还要求初值误差 $\\eta^\\varepsilon\\le\\varepsilon$。论文明确指出，非准备数据一般会产生频率为 $O\(\\varepsilon^\{-1\}\)$ 的快速声学振荡，不能直接得到相同的时间连续强收敛。结果未覆盖大数据、激波、非等熵系统、一般有界域或无准备数据下的全局强收敛与相同收敛速率。

**证明逻辑/大纲**

1. **主张：** 在小初值条件下建立独立于 $\\varepsilon$ 的全局强解先验估计。
   - **路线：** 先用速度变量的宏观--微观分解和 Fokker--Planck 算子的强制性得到零阶耗散；再对方程施加空间导数，采用压力系数对称化处理奇异声学项。通过矩方程恢复宏观矩的梯度耗散，并加入补偿能量泛函控制 $\\nabla\_xq^\\varepsilon$；将各层估计组合为 $X^\\varepsilon$ 与 $D^\\varepsilon$，得到 $\\frac\{d\}\{dt\}X^\\varepsilon\+\\lambda\_5D^\\varepsilon\\le0$，再以连续性论证延拓到全局。
2. **主张：** 控制不可压缩极限压力及其物质导数，为误差估计提供可积的压力源项。
   - **路线：** 对不可压缩方程施加 Helmholtz 梯度投影 $Q$，从而由公式 4\.1 表示 $\\nabla\_x\\pi$；对 $D\_t\\pi$ 使用投影交换子估计。处理 $\\\|\\partial\_t\\pi\\\|\_\{\\dot H^\{-1\}\}$ 时，将 $b-u$ 的方程分别施加 $P$ 和 $Q$，利用公式 4\.10--4\.13 的阻尼半群表示与极限解衰减，获得 $\\dot H^\{-1\}$ 时间可积性，最终闭合压力的空间和时间估计。
3. **主张：** 通过修正声学变量建立低阶和高阶误差能量估计。
   - **路线：** 定义 $\\delta q$、$\\delta u$、$\\delta f$ 及误差泛函 $\\delta X$，推导误差系统公式 5\.2--5\.3。对误差方程分别进行零阶和一至二阶空间导数的能量估计，利用声学主项的结构性抵消、宏观--微观耗散以及 Proposition 1\.2 的压力界，得到含小系数的闭合估计公式 5\.4 和 5\.11。
4. **主张：** 控制误差宏观矩和密度梯度的额外耗散，并完成全局 $H^2$ 误差闭合。
   - **路线：** 从误差矩方程构造时间补偿泛函 $E\_0$，对称梯度和散度项分别给出宏观矩耗散，得到 Lemma 5\.3 的公式 5\.17；再对误差动量方程与 $\\nabla\_x\\delta q$ 做交叉能量估计，得到 Lemma 5\.4 的公式 5\.29。将公式 5\.4、5\.11、5\.17、5\.29 合并，在初值小量条件下吸收 $\\delta X\(t\)$ 右端项，得到 $\\delta X\(t\)\\lesssim\\varepsilon^2$ 并证明 Theorem 1\.2。
5. **主张：** 由误差估计取得强收敛并在分布意义下识别不可压缩 Euler--VFP 极限。
   - **路线：** 先由全局误差估计直接得到 $q^\\varepsilon$、$u^\\varepsilon$、$f^\\varepsilon$ 及其宏观矩的时间连续强收敛；将连续性方程乘以 $\\varepsilon$ 得到公式 5\.35--5\.39，从而证明极限速度无散。对动量方程施加 Leray 投影 $P$ 消去奇异梯度压力，得到公式 5\.40--5\.45；最后对动理学方程逐项使用强收敛和 Fokker--Planck 算子的自伴性，依据公式 5\.46--5\.50 完成分布意义极限。

**排序理由**

正文核查显示该文围绕“低马赫数极限与全局误差收敛”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 89/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：论文 PDF 全文逐页核查（第 1--34 页），覆盖正文、全部证明、Acknowledgements、Conflict of interest、Data availability statement 与 References，并执行 AI/LLM 相关关键词检索。

**原始英文摘要**

Although there are many important contributions on compressible and incompressible fluid-particle interaction models respectively, how to connect the two-type fluid-particle models via the low Mach number limit remains a challenging open problem\. In this paper, we resolve it for the compressible isentropic fluid-particle model \(Euler--Vlasov--Fokker--Planck \(Euler--VFP\) system\) in the whole space $\\mathbb\{R\}^3$\. First, we establish the global-in-time \{\\it a priori estimates\} of strong solutions that are uniform with respect to the Mach number $\\varepsilon$ near the global Maxwellian\. The proof relies on a refined energy method that combines the relaxation structure $b^\\varepsilon-u^\\varepsilon$ induced by the fluid-particle interaction and the symmetrized acoustic structure of the compressible Euler part in the model\. Under the assumption of well-prepared initial data, we derive a \{\\it global-in-time\} uniform error estimate in the $H^2$ framework between the solution of the compressible Euler--VFP system and that of the limiting incompressible Euler--VFP system\. A key point is to introduce the corrected acoustic variable $ q^\\varepsilon-\\varepsilon \[P'\(1\)\]^\{-1\}\\pi$, which captures the pressure corrector in the low Mach number limit\. This also allows us to exploit the exact cancellation of the singular acoustic terms and to close the \{\\it global-in-time\} error estimate\. The damping term $b^\\varepsilon-u^\\varepsilon$, which is absent in the pure Euler equations, plays an essential role in recovering the relative velocity dissipation and in controlling the coupled fluid-particle dynamics\. As a consequence, we prove the low Mach number limit of the compressible Euler--VFP system with the convergence rate $\\mathcal O\(\\varepsilon\)$ in the time-continuous $H^2$ topology\.

---

#### Weak Solutions for the Unregularised Hibler Momentum Equation with Degenerate Coefficients

- **作者：** Henrik Schneider
- **arXiv：** [2609\.12925](https://arxiv.org/abs/2609.12925) · [PDF](https://arxiv.org/pdf/2609.12925)
- **分类：** math\.AP
- **进展类型：** 弱解存在性与时间独立强度下唯一性
- **阅读优先级：** 84/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究未正则化 Hibler 海冰动量方程，其中冰质量和冰强度允许退化或消失。作者将应力律和混合边界条件编码为凸耗散泛函，证明时间离散问题的存在性、唯一性与稳定性，并通过 Rothe 逼近得到时间依赖系数下的全局弱变分解；当冰强度与时间无关时进一步证明弱解唯一。

**使用技术**

- 凸支撑函数与耗散泛函表示
- Fenchel 对偶和次微分应力重构
- 单调算子变分不等式
- 海洋阻力提供的强制性估计
- 加权能量估计与离散求和
- Rothe 时间离散、Minty 单调性识别
- 单侧指数时间卷积与恢复序列
- 切片法和法向迹理论

**可能的突破**

在不要求冰质量或冰强度正下界、允许空 Dirichlet 边界部分的条件下，定理 6\.1 建立了时间离散变分不等式的唯一解和数据稳定性。定理 7\.3 证明满足质量单侧增长条件的时间依赖问题存在全局弱变分解，并给出加权动能、海洋阻力耗散和塑性耗散的能量估计；当冰强度 $\\mathit\{P\}$ 与时间无关时，所有允许退化区域的弱解在速度意义下唯一。定理 4\.5 还在空间 Lipschitz 冰强度下给出加权变形的局部测度结构。

**限制与不确定性**

时间依赖冰强度下的弱解唯一性仍未解决，因为单侧时间卷积的耗散控制需要时间不变的 $P$。完整的时间演化应力与流动律表述、内部界面条件解释以及与冰厚度和浓度输运方程的耦合均未建立。一般连续时间依赖 $P$ 下没有声称时空测度结构；有限耗散只控制加权变形，不能直接提供耦合所需的速度正则性。

**证明逻辑/大纲**

1. **主张：** 引理 4\.3、引理 4\.4 建立耗散泛函的凸性、边界表示和饱和应力重构。
   - **路线：** 把耗散定义为 admissible stress 散度作用的支撑函数，利用弱连续线性泛函的上确界得到凸性和弱下半连续性。通过内部与边界的分离截断、平滑近似和切片法证明体积耗散加 Dirichlet 边界项的表示；再用 Fenchel 对偶刻画次微分，从而构造满足 $\\xi=-\\operatorname\{div\}\\sigma$ 和饱和等式的应力。
2. **主张：** 定理 6\.1 证明时间离散变分不等式存在唯一解并给出稳定性。
   - **路线：** 将方程写成凸耗散项加非线性算子 $A$ 的第二类变分不等式。验证 $A$ 的有界性、半连续性、严格单调性和强制性，其中海洋阻力项提供 $L^3$ 控制，质量项和科氏项不需要正下界。对两个解作差并利用阻力的单调估计，得到关于外力和海洋速度的数据稳定性。
3. **主张：** 定理 7\.3\(a\) 通过 Rothe 离散证明时间依赖系数下弱变分解的存在性和能量估计。
   - **路线：** 在分割时间区间上取离散质量、强度和指数权重，应用定理 6\.1 得到逐步解。加权离散能量不等式利用质量增长条件产生望远镜求和，从而获得速度、加权质量动能和耗散的统一界。取弱收敛子列后，用 Minty 单调性把算子移到光滑测试函数，利用耗散泛函的弱下半连续性和系数一致逼近通过极限，得到定义 7\.1 的弱变分不等式。
4. **主张：** 定理 7\.3\(b\) 在时间不变冰强度下证明弱解唯一性。
   - **路线：** 先用 Fenchel--Moreau 和 Hahn--Banach 构造保持耗散收敛的光滑恢复序列，再以单侧指数时间卷积修正初值并控制时间项。引理 7\.6 通过 Minty 扰动恢复在解处评价的单调算子。对两个解取平均值作为恢复目标，在两个变分不等式相加后利用耗散凸性和海洋阻力严格单调性，得到解差的 $L^3$ 范数为零。

**排序理由**

正文核查显示该文围绕“弱解存在性与时间独立强度下唯一性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 84/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 摘要、正文各节、开放问题、第 8 节末尾、附录、References 前后的文末区域以及全部可检索声明文本。正文末尾直接进入 References，未设 Acknowledgements、Data Availability 或 Declarations 专门段落；检索到的 artificial 仅指模型背景中的 artificial elastic component，不属于作者工具披露。

**原始英文摘要**

We study the momentum equation of the decoupled unregularised Hibler sea-ice model with non-negative ice mass and ice strength, both of which may vanish\. The ocean drag provides coercivity, while the stress law and mixed boundary conditions are encoded by a convex dissipation functional\. We prove existence, uniqueness and stability for the time-discrete problem and reconstruct an admissible stress\. A Rothe approximation yields global weak variational solutions for time-dependent coefficients under a one-sided growth condition on the mass\. Weak solutions are unique when the ice strength is independent of time\. For spatially Lipschitz ice strength, finite dissipation also yields a local measure structure of the weighted deformation and a global bound on the negative part of the weighted divergence\.

---

#### On energy equality of the 3D anisotropic Navier-Stokes equations

- **作者：** Yulin Ye、Wei Wei、Yanqing Wang
- **arXiv：** [2609\.12383](https://arxiv.org/abs/2609.12383) · [PDF](https://arxiv.org/pdf/2609.12383)
- **分类：** math\.AP
- **进展类型：** 能量守恒判据
- **阅读优先级：** 83/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究三维仅水平耗散的各向异性 Navier-Stokes 方程，即缺少垂直耗散项的系统。作者针对周期区域和全空间中的 Leray-Hopf 弱解，证明三类 Lions-Shinbrot 型额外可积性条件足以恢复能量恒等式：速度属于临界时空 Lebesgue 类、速度满足标准尺度关系，或速度梯度满足各向异性尺度关系。周期情形使用空间平滑、分量拆分和 Constantin-E-Titi 型交换子；全空间情形改用散度自由场下的各向异性交换子估计。

**使用技术**

- 空间卷积平滑、测试函数能量法与极限交换
- 散度自由条件下的水平和垂直分量拆分、分部积分
- Constantin-E-Titi 型交换子估计
- DiPerna-Lions 型各向异性交换子估计
- Holder 不等式、Gagliardo-Nirenberg 不等式与自然能量界
- Leray-Hopf 弱解框架和水平耗散能量估计

**可能的突破**

论文证明即使三维系统只有水平耗散 $\\Delta\_h$，经典的 Lions-Shinbrot 型能量守恒条件仍适用。作者分别在 $\\mathbb\{T\}^3$ 和 $\\mathbb\{R\}^3$ 上建立能量恒等式，并将速度梯度条件推广到各向异性临界关系 $1/p\+6/\(5q\)=1$、$q\\ge9/5$，从而覆盖没有最大正则性的弱解情形。

**限制与不确定性**

结论是对 Leray-Hopf 弱解的充分能量守恒判据，不是必要条件，也不涉及弱解存在性、唯一性或正则性。模型固定为仅水平耗散的常系数三维系统，未处理边界、变量系数或一般外力。全空间部分主要依赖 Lemma 2\.4 的各向异性交换子，并在最后说明按周期情形重复指数论证，正文细节相对简略。能量恒等式仍需额外时空可积性，不能仅由自然能量空间自动推出。

**证明逻辑/大纲**

1. **主张：** 建立平滑交换子和各向异性散度交换子工具，并固定弱解框架。
   - **路线：** 第 2 节先给出乘积平滑误差的强收敛、梯度平滑估计及 Constantin-E-Titi 型交换子界。Lemma 2\.4 针对散度自由向量场，将缺少垂直导数控制的问题转化为水平导数交换子和一个可由平移连续性处理的垂直项；公式 \(2\.6\)--\(2\.16\) 中利用散度自由条件使极限完全抵消。Definition 2\.1 固定弱解只具有 $u\\in L^\\infty\_tL^2\_x$ 和 $\\nabla\_hu\\in L^2\_tL^2\_x$ 的自然能量正则性。
2. **主张：** 在周期区域中，基础可积性条件使正则化能量恒等式的所有非线性误差消失。
   - **路线：** 将方程空间平滑并与 $u^\\varepsilon$ 配对，得到公式 \(3\.2\) 的能量平衡和两个对流误差 $I,II$。利用散度自由条件及分部积分，把水平和垂直分量拆成 $I\_1,I\_\{21\},I\_\{22\},I\_\{23\}$ 及 $II\_1,II\_2,II\_3$，见 \(3\.3\)--\(3\.17\)。在条件 \(3\.5\) 下，Lemma 2\.1 使低阶交换子趋于零，Lemma 2\.2--2\.3 控制垂直项中的平滑梯度和乘积误差，因而 \(3\.9\)--\(3\.22\) 给出 $I,II\\to0$。最后用自然能量界和 Gagliardo-Nirenberg 不等式验证 Theorem 1\.1 的三类假设分别推出 \(3\.5\)，其中公式 \(3\.23\)--\(3\.25\) 处理速度条件和梯度条件。
3. **主张：** 在全空间中，利用各向异性散度交换子得到 Theorem 1\.2 的能量恒等式。
   - **路线：** 平滑后的能量式仍为 \(3\.26\)，但全空间中将对流项直接改写为 $\\operatorname\{div\}\[u u\_i^\\varepsilon-\(u u\_i\)^\\varepsilon\]$ 与平滑速度配对，见 \(3\.27\)--\(3\.30\)。对水平分量，Lemma 2\.4 在条件 \(3\.31\) 下给出 \(3\.33\)，从而 $I\\to0$。由 $\\operatorname\{div\}u=0$ 和水平导数控制可推出 $\\nabla u\_3\\in L^p\_tL^q\_x$，再对垂直项分部积分并使用平滑乘积收敛，得到 \(3\.35\)--\(3\.36\) 中 $II\\to0$。于是基础条件 \(3\.31\) 导出能量恒等式，再沿用周期情形的 Gagliardo-Nirenberg 推导，得到 Theorem 1\.2 的三个判据。

**排序理由**

正文核查显示该文围绕“能量守恒判据”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 83/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已检查官方 arXiv PDF 第 1--16 页，重点核查第 1--3 页摘要和主定理、第 4--13 页正文证明、第 13 页 Acknowledgements、Author Declarations、Data Availability 及第 13--16 页文末 References；同时检索全文中的 AI、LLM、ChatGPT、GPT、OpenAI、artificial intelligence、language model、software、code 和工具声明相关表述，未发现明确披露。

**原始英文摘要**

In the spirit of the recent work by Demmel and Wiedemann \\cite\{\[DW\]\}, we investigate the validity of the energy balance law for weak solutions to the three-dimensional Navier-Stokes equations with only horizontal dissipation\. We prove that famous Lions-Shinbrot type energy conservation criteria, originally established for the classical isotropic Navier-Stokes equations, continue to hold in this anisotropic setting\. Furthermore, we present two distinct approaches that handle the torus case and the whole space case, respectively\.

---

#### On space-time derivative estimates for the fractional Navier-Stokes equations

- **作者：** Yanqing Wang、Wei Wei、Gang Wu、Daoguo Zhou
- **arXiv：** [2609\.12864](https://arxiv.org/abs/2609.12864) · [PDF](https://arxiv.org/pdf/2609.12864)
- **分类：** math\.AP
- **进展类型：** 分数阶纳维--斯托克斯方程时空导数估计
- **阅读优先级：** 74/100 · 中优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--36 页。论文研究三维全空间分数阶 Navier--Stokes 方程的时空导数先验估计，在 $5/6&lt;\\alpha&lt;5/4$ 下建立任意阶时间导数与空间--时间分数阶导数的时间可积性，并在标准 Navier--Stokes 情形 $\\alpha=1$ 下推出一族 $L^\{q/\(q-3\)\}\_tL^q\_x$ 正则性估计。

**使用技术**

- Littlewood--Paley 分解与 Bernstein 不等式
- 分数阶 Sobolev 插值和 Gagliardo--Nirenberg 不等式
- Kato--Ponce 对易子与分数阶 Leibniz 法则
- 时间微分能量阶梯与辅助微分不等式
- 双指标归纳、Young 吸收与时间可积性引导

**可能的突破**

核心进展是将已有的空间导数估计推广到时间导数及空间--时间混合导数：对任意 $m,n\\in\\mathbb\{N\}$，控制 $\\Lambda^\{n\\alpha\}u\_t^\{\(m\)\}$ 和 $\\Lambda^n u\_t^\{\(m\)\}$ 的时间可积性，并通过另一组时间导数估计作为归纳基底闭合空间--时间估计。论文还在 $\\alpha=1$ 时得到标准 Navier--Stokes 解的 $L^\{q/\(q-3\)\}\_tL^q\_x$ 型速度及高阶分数阶导数估计。

**限制与不确定性**

论文始终假设解是光滑解，所得结论是先验估计，不等同于对三维分数阶 Navier--Stokes 方程建立新的全局光滑解存在性或正则性定理。参数范围限定为 $5/6&lt;\\alpha&lt;5/4$，空间为 $\\mathbb\{R\}^3$，估计依赖 Hilbert 型 Sobolev 空间和特定时间可积指数。对 $\\alpha&lt;5/4$ 的一般弱解，论文没有据此排除奇性；也未处理有界区域、非光滑初值、临界端点的完整估计或非 Hilbert 型 $W^\{s,p\}$ 理论。

**证明逻辑/大纲**

1. **主张：** 建立分数阶非线性项的插值控制和基础能量阶梯。
   - **路线：** 利用分数阶 Sobolev 插值估计控制 $\\\|\\nabla u\\\|\_\{L^\{\\alpha/3\}\}$，将非线性内积通过 Hölder 不等式化为 $\\\|\\Lambda^\\alpha u\\\|\_\{L^2\}$、$\\\|\\Lambda^\{2\\alpha\}u\\\|\_\{L^2\}$ 和低阶范数的乘积，再用 Young 不等式吸收最高阶耗散。对原方程及其一次时间导数分别测试，得到包含 $u\_t$、$\\Lambda^\\alpha u\_t$、$u\_\{tt\}$ 的阶梯微分不等式。
2. **主张：** 由基础阶梯推出任意阶时间导数的时间可积性，完成 Theorem 1\.2。
   - **路线：** 对方程反复作时间微分，Lemma 3\.2 将第 $r$ 阶时间导数的能量和耗散写成低阶时间导数的递归组合。定义 $F\_\{r,0\}$、$G\_\{r,0\}$、$F\_\{r,1\}$、$G\_\{r,1\}$，先用 $r=1$ 的基础估计建立归纳起点，再假设所有低阶结论成立，将递归项合并并选择足够小的吸收参数，得到形如 $\\frac\{d\}\{dt\}F\+G\\le C F^\\theta$ 的不等式；应用 Lemma 2\.1 将其转化为时间 $L^p$ 可积性，逐阶得到 $u\_t^\{\(k\)\}$ 的估计。
3. **主张：** 将时间导数估计提升为空间--时间分数阶导数估计，完成 Theorem 1\.1。
   - **路线：** 对时间微分后的方程施加 $\\Lambda^\{s\\alpha\}$，以 $\\Lambda^\{2\(s\+1\)\\alpha\}u\_t^\{\(r\)\}$ 测试，使用与基础步骤相同的插值、分数阶 Leibniz 法则和 Young 吸收，得到 Lemma 4\.1 的递推不等式。随后定义双指标能量 $F\_\{p,q\}$ 与耗散 $G\_\{p,q\}$，以 $p\+q$ 为归纳量：低指标由第 3 节的时间估计提供，递推中所有低阶项由归纳假设控制，最终得到公式 4\.19，并恢复主定理所需的空间--时间积分指数。
4. **主张：** 在标准 Navier--Stokes 情形推出一般 $L^q$ 空间正则性族。
   - **路线：** 令 $\\alpha=1$，将基础能量估计与已经得到的高阶空间--时间估计进行插值，配合 Sobolev 嵌入选择时间和空间指数，得到速度及 $\\Lambda^k u$ 的 $L^\{q/\(q-3\)\}\_tL^q\_x$ 型界；再利用 Calderón--Zygmund 定理将 $\\Lambda$ 替换为整数阶导数或等价的 Fourier 乘子。

**排序理由**

正文核查显示该文围绕“分数阶纳维--斯托克斯方程时空导数估计”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 74/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：论文 PDF 全文逐页核查（第 1--36 页），覆盖 Introduction、Preliminaries、Sections 3--4、定理证明、正文末尾和 References，并执行 AI/LLM 相关关键词检索。

**原始英文摘要**

In this paper, we are concerned with space-time derivative estimates of solutions to the fractional Navier-Stokes equations\. It is shown that $\\Lambda^\{n\\alpha\}u^\{\(m\)\}\_\{t\} \\in L^\{\\frac\{2\(6\\alpha-5\)\}\{4m\\alpha\+2n\\alpha\+4 \\alpha-5\}\}~~~~~~~\(0,T; L^\{2\}\(\\mathbb\{R\}^\{3\}\)\)$ and $ \\Lambda^\{n \}u^\{\(m\)\}\_\{t\} \\in L^\{\\frac\{2\(6\\alpha-5\)\}\{4m\\alpha\+2n \+4 \\alpha-5\}\}~~~~~\(0,T; L^\{2\}\(\\mathbb\{R\}^\{3\}\)\)$\. This generalizes a priori bounds for the classical Navier-Stokes system by Duff in \[7, Acta Math\. 164, 1990\] and Boutros and Gibbon's spatial derivative estimates in \[1, Nonlinearity 37, 2024\]\. In addition, we derive that $ u \\in L^\{\\frac\{q\}\{q-3\}\}~~\(0,T;L^\{q\} \(\\mathbb\{R\}^\{3\}\)\)$ with $ 6\\leq q\\leq\\infty $ and $\\Lambda^\{k\}u \\in L^\{\\frac\{q\}\{ q\(k\+1\)-3\}\}~~~\(0,T;L^\{q\} \(\\mathbb\{R\}^\{3\}\)\) $ with $k\\geq1, 2\\leq q\\leq\\infty $ in the standard Navier-Stokes equations\.

---

#### On space-time derivative estimates for the magnetohydrodynamic equations

- **作者：** Yanqing Wang、Wei Wei、Gang Wu、Yulin Ye
- **arXiv：** [2609\.12901](https://arxiv.org/abs/2609.12901) · [PDF](https://arxiv.org/pdf/2609.12901)
- **分类：** math\.AP
- **进展类型：** 磁流体方程时空导数估计
- **阅读优先级：** 72/100 · 中优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--41 页。论文在三维全空间的光滑不可压 MHD 系统中建立任意阶时间导数以及空间--时间导数的时间可积性估计，并由此得到 $u,B\\in L^\{q/\(q-3\)\}\(0,T;L^q\(\\mathbb\{R\}^3\)\)$（$6\\le q\\le\\infty$）以及 $D^k u,D^k B\\in L^\{q/\(q\(k\+1\)-3\)\}\(0,T;L^q\(\\mathbb\{R\}^3\)\)$（$k\\ge1$、$2\\le q\\le\\infty$）。

**使用技术**

- 不可压 MHD 能量恒等式与速度--磁场耦合抵消
- Gagliardo--Nirenberg 插值、Sobolev 嵌入与 Young 吸收
- Kato--Ponce 对易子估计与分数阶 Leibniz 法则
- 时间微分能量阶梯与 Lemma 2\.1 的时间可积性提升
- 空间--时间双指标归纳与 $L^q$ 插值正则性

**可能的突破**

核心进展是把 Duff 对经典 Navier--Stokes 方程的时空导数估计推广到 MHD 系统，并对 Zheligovsky 提出的问题给出肯定回答。论文利用速度与磁场非线性耦合在 $L^2$ 能量中的积分分部抵消，证明任意 $k$ 阶时间导数满足定理 1\.1 的可积性，再通过空间--时间双指标归纳得到定理 1\.2，最后推出上述 $L^q\_tL^q\_x$ 型空间正则性。

**限制与不确定性**

结论是光滑解上的先验估计，依赖有限时间区间 $\(0,T\)$、全空间 $\\mathbb\{R\}^3$、不可压且常系数的标准 MHD 方程及足够光滑的初值；它不证明全局光滑解存在，也不闭合弱解的正则性。论文未覆盖有界区域及边界条件、低正则初值、可变系数、可压缩或 Hall MHD 及其他非标准扩展，亦未给出超出定理指数范围的端点或一般 $L^p$ 能量理论；正文还指出耦合项的抵消在 $p\\ne2$ 时可能失效。另外，定理 1\.1 和 1\.2 将索引写成非负整数，但公式 \(1\.8\)、\(1\.9\) 在 $k=0$ 或 $m=n=0$ 时给出负的时间积分指数；证明从正阶索引开始，因此这些端点索引需按正阶或另行约定解释。

**证明逻辑/大纲**

1. **主张：** 建立低阶空间和时间导数的能量阶梯。
   - **路线：** 对原 MHD 方程分别以 $D^2u,D^2B$ 及 $u\_t,B\_t$ 测试并在空间积分，利用散度约束和积分分部使速度--磁场耦合项抵消；对方程作一次时间微分得到 \(3\.13\)，再利用 $\\int B\\cdot\\nabla B\_t\\cdot u\_t\\,dx=-\\int B\\cdot\\nabla u\_t\\cdot B\_t\\,dx$ 的配对抵消，结合 Hölder、Gagliardo--Nirenberg、Sobolev 和 Young 不等式吸收高阶项。
2. **主张：** 由重复时间微分和归纳证明任意阶时间导数估计。
   - **路线：** 用 Leibniz 公式反复时间微分得到 \(3\.26\)--\(3\.29\)，建立 $F\_\{r,0\},F\_\{r,1\},G\_\{r,0\},G\_\{r,1\}$ 的递推能量不等式；以 $r=1$ 的估计 \(3\.50\)--\(3\.58\) 为基步，假设低阶可积性后用 \(3\.59\)--\(3\.70\) 控制所有乘积项，并应用 Lemma 2\.1 将微分不等式转换成目标时间可积性，从而闭合定理 1\.1 的指数 $2/\(4k-1\)$。
3. **主张：** 建立含空间导数和时间导数的递推能量不等式。
   - **路线：** 对时间微分后的 MHD 方程施加空间微分算子 $D^s$，以相应高阶导数测试；用 Kato--Ponce 对易子、分数阶 Leibniz、插值和 Sobolev 估计非线性项，并保留速度--磁场耦合的积分分部抵消，得到关于 $D^s u\_t^\{\(r\)\}$、$D^s B\_t^\{\(r\)\}$ 的递推式，再以 Lemma 2\.1 提升可积性。
4. **主张：** 通过空间--时间双指标归纳闭合定理 1\.2。
   - **路线：** 定义双指标能量 $F\_\{p,q\},G\_\{p,q\}$ 并由 \(4\.24\) 统一表述目标递推；先用定理 1\.1 完成 $p\+q=1$ 的基步，再完成 $p\+q=2$，随后假设 $p\+q\\le m\+n-2$，按四种指标情形估计 \(4\.43\)--\(4\.67\)，选取小参数吸收耦合项，最后用 Lemma 2\.1 得到 \(4\.68\)--\(4\.69\)，即 $D^n u\_t^\{\(m\)\},D^n B\_t^\{\(m\)\}\\in L^\{2/\(4m\+2n-1\)\}\(0,T;L^2\(\\mathbb\{R\}^3\)\)$。
5. **主张：** 由高阶估计和插值推出空间 $L^q$ 时空正则性。
   - **路线：** 先用 Gagliardo--Nirenberg 不等式与 Sobolev 嵌入得到 $D^k u,D^k B\\in L^\{k\+1\}\(0,T;L^\\infty\)$，再分别与能量级 $L^2$ 控制作空间插值并在时间上使用 Hölder 不等式，得到 $u,B$ 以及 $D^k u,D^k B$ 的目标时空指数。

**排序理由**

正文核查显示该文围绕“磁流体方程时空导数估计”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 72/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：论文 PDF 全文逐页核查（第 1--41 页），覆盖 Introduction、Sections 2--4、定理证明、正文末尾及 References；同时执行 AI/LLM 相关关键词检索，未发现相关披露。

**原始英文摘要**

In this paper, we present the space-time derivative estimates of solutions to the MHD equations\. It is a generalization of a priori bounds for the classical Navier-Stokes system by Duff in \\cite\[Acta Math\. 164, 1990\]\{\[Duff\]\} and gives an affirmative answer to a question proposed by Zheligovsky in \\cite\[Mathematics\. 9, 2021\]\{\[Zheligovsky\]\}\. In addition, we show that $u, B \\in L^\{\\f\{q\}\{q-3\}\}\(0,T;L^\{q\} \(\\mathbb\{R\}^\{3\}\)\)$ with $6\\leq q\\leq\\infty $ and $ D ^\{k\}u, D ^\{k\}B \\in L^\{\\f\{q\}\{ q\(k\+1\)-3\}\}\(0,T;L^\{q\} \(\\mathbb\{R\}^\{3\}\)\)$ for $k\\geq1, 2\\leq q\\leq\\infty$ in this system\.

---

#### How turbulent flows grow vorticity at a point

- **作者：** Timo Schorlepp、Vladimir Rosenhaus、Gregory Falkovich
- **arXiv：** [2609\.13056](https://arxiv.org/abs/2609.13056) · [PDF](https://arxiv.org/pdf/2609.13056)
- **分类：** math-ph、math\.AP、nlin\.CD
- **进展类型：** 湍流涡量增长的波碰撞瞬子机制
- **阅读优先级：** 68/100 · 中优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文结合轴对称数值优化与涡量动力学分析，研究三维不可压 Navier--Stokes 湍流中由大尺度随机力产生指定点高涡量的最可能力历史，即涡量瞬子。结果显示，低涡量时径向压缩和轴向拉伸可以单调放大涡管；超过阈值后，Coriolis 力使涡量峰分裂成沿轴向传播的波，最终通过两列波碰撞在拉伸和压缩区域形成高涡量细长涡丝。作者还给出涡核尺度的经验标度，但明确指出该标度具有猜测性。

**使用技术**

- Navier--Stokes 方程与涡量动力学
- 高斯随机力和作用量最小化
- 轴对称瞬子数值优化
- 涡量波传播与碰撞分析
- Coriolis 力和径向压缩机制
- 涡管拉伸与黏性扩散平衡
- 作用量随目标涡量的标度拟合
- 涡核半径、轴向长度和纵横比估计
- 响应场方程与投影算子形式化

**可能的突破**

论文识别出高涡量瞬子的两阶段机制：低涡量区可由单调径向压缩和轴向拉伸实现，而当目标涡量约超过 $a\\simeq70$ 至 $80$ 后，Coriolis 恢复力诱导涡量峰分裂，最优外力沿传播脉冲供能并通过轴向反向流减慢脉冲，最终由两列涡量波碰撞完成放大。对于最大计算样本 $a=1033$，作者观察到多次分裂与融合；最后阶段的无外力增长由波碰撞、轴向拉伸和径向压缩共同驱动。基于涡量体积近似守恒，作者提出 $\\sigma\\propto a^\{4/5\}$、$\\delta\\propto a^\{-2/5\}$、$\\ell\\propto a^\{-1/5\}$，并与数值结果相符。

**限制与不确定性**

结果主要来自轴对称数值瞬子和有限目标涡量范围，阈值及作用量标度依赖所选力协方差、黏性和无量纲单位。文中的涡量体积守恒假设及由此得到的标度被作者明确称为高度猜测，可能在更高涡量下改变。研究没有证明有限时间 Navier--Stokes 奇性，也没有系统处理非轴对称分支、直接数值模拟中的条件平均或更高涡量下分裂次数。该文没有定理及形式化证明结构。

**证明逻辑/大纲**

正文不采用定理证明结构。

**排序理由**

正文核查显示该文围绕“湍流涡量增长的波碰撞瞬子机制”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 68/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1 页摘要与引言、第 5--6 页 Conclusion 和 Acknowledgments，以及第 6--7 页 Methods、参考文献；第 6 页 Acknowledgments 明确写明未将 AI 用于计算和写作。

**原始英文摘要**

We describe how strong vorticity fluctuations appear in three-dimensional incompressible turbulence driven by a large-scale random force\. By combining analytical and numerical methods, we construct a vorticity instanton: the most probable force history driving the flow to a prescribed large vorticity at a given point and time\. We show how the smooth, large-scale force produces a long vortex filament with a thin, viscous-scale core\. Our main finding is that the standard mechanism of amplifying a vortex tube through radial compression and axial stretching is only effective up to a threshold value\. Producing vorticity above the threshold requires an additional ingredient: vorticity waves propagating along the tube\. The final vorticity is the result of two colliding waves\. This mechanism has striking similarities to the one recently suggested by OpenAI for creating infinite vorticity in finite-time Navier--Stokes blow-up\.

---

### 双曲方程与守恒律

#### Regularity of Structurally Stable Cusp Singularities for Two Families of Quasilinear Wave-type Equations

- **作者：** Samuel J\. Armstrong、Geng Chen、Tao Huang、Yannan Shen
- **arXiv：** [2609\.12926](https://arxiv.org/abs/2609.12926) · [PDF](https://arxiv.org/pdf/2609.12926)
- **分类：** math\.AP
- **进展类型：** 结构稳定尖点的局部正则性
- **阅读优先级：** 88/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究两类拟线性波型方程中结构稳定 cusp 奇点的正则性。作者将 Hunter--Saxton 型方程及含非局部源项的 Camassa--Holm 型方程变换为半线性系统，利用横截性扰动证明 generic 奇点只分为奇异曲线上的 Type I 和奇异形成点的 Type II，并通过分数幂坐标展开得到局部 Hölder 指数。

**使用技术**

- 特征线坐标与半线性系统变换
- Thom 型横截性和有限参数扰动
- 隐函数定理刻画奇异曲线
- 分数幂变量变换
- 局部 Taylor 展开与高阶导数消失
- 坐标反演和主项匹配
- 非局部源项的 Lipschitz 正则性传递

**可能的突破**

定理 1\.5 给出结构稳定奇点的精确局部展开：Type I 奇异曲线附近的主阶为 $1/\(1\+\\lambda\)$，Type II 奇异形成点附近的主阶为 $\(2-\\lambda\)/\(2\+\\lambda\)$。当 $\\lambda\\to 1$ 时，Type II 指数趋于 $1/3$，与标量守恒律 generic pre-shock 正则性一致。结果覆盖 $\\lambda=1/n$ 的 Hunter--Saxton 型情形以及 $\\lambda=1/\(2a\)$ 的 Camassa--Holm 和 Novikov 型情形。

**限制与不确定性**

正文中的 generic 存在性定理主要限于 $\\lambda=1/n$ 或 $\\lambda=1/\(2a\)$ 的离散参数，并且含非零源项情形的定理 1\.3 证明被简略为与无源情形相同。作者指出对一般 $\\lambda\\in\(0,1\)$，尤其无理数参数，分数幂变量在 $Y-Y\_0&lt;0$ 一侧的处理需要额外工作。论文只处理 Type I 和 Type II，没有展开更高阶退化或不同 cusp 家族交点的完整正则性。

**证明逻辑/大纲**

1. **主张：** 定理 1\.1 证明 generic 初值产生的解在有限条特征曲线外为 $C^2$，并且奇异集由有限条光滑曲线和有限个点组成。
   - **路线：** 沿特征线引入 $\(Y,\\tau\)$ 坐标及变量 $\(u,v,\\xi\)$，把原方程化为半线性系统（2\.4）。引理 2\.2 通过三参数初值扰动使 $\(v,v\_Y,v\_\{YY\}\)$ 或 $\(v,v\_Y,v\_\\tau\)$ 的参数导数满秩；引理 2\.3 将避免联合退化值的解集证明为相对开且稠密。对 $v=\\pi$ 使用隐函数定理得到有限条 $C^2$ 奇异曲线，再由坐标映射的 Jacobian 非退化性将其送回 $\(x,t\)$ 平面。
2. **主张：** Type I 奇点满足定理 1\.5\(i\) 的分数幂局部展开。
   - **路线：** 在 $v\(Y\_0,\\tau\_0\)=\\pi$ 且 $v\_Y\(Y\_0,\\tau\_0\)\\neq0$ 时，引入 $W=\(Y-Y\_0\)^\{1/\\lambda\}$ 和 $Z=\(Y-Y\_0\)^\{\(1\+\\lambda\)/\\lambda\}$，使含 $\\sin\(v/2\)$ 和 $\\cos\(v/2\)$ 的奇异因子转化为可积幂次。对 $u$ 和 $x$ 分别积分得到主项及余项，再反解 $x-x\_0-f'\(u\_0\)\(t-t\_0\)$ 与 $Y-Y\_0$ 的关系，代回 $u$ 展开，闭合为指数 $1/\(1\+\\lambda\)$ 的 cusp 形式。
3. **主张：** Type II 奇点满足定理 1\.5\(ii\) 的更高阶 cusp 展开。
   - **路线：** 在 $v=\\pi$、$v\_Y=0$、$v\_\{YY\}\\neq0$ 时，使用适配的分数幂变量并利用半线性系统计算导数。由于低阶 $Y$ 导数在奇点处连续消失，首个非零项由 $v\_\{YY\}$ 控制；分别展开 $u$ 和 $x$，求解特征方向位移的主项，再代回得到指数 $\(2-\\lambda\)/\(2\+\\lambda\)$，余项由剩余 Taylor 项和时间变量阶数控制。
4. **主张：** 含非零源项的 Camassa--Holm 型方程保持相同的奇点正则性，并在 Camassa--Holm 与 Novikov 情形给出具体指数。
   - **路线：** 对含源项方程重新定义特征坐标，得到半线性系统（4\.3）和坐标导数（4\.5）。当非局部量 $P,Q$ 及其导数具有 Lipschitz 正则性时，Type I 和 Type II 的局部展开沿用无源情形。对 Camassa--Holm 方程计算混合导数并得到 Type II 指数 $3/5$；对 Novikov 方程继续计算高阶混合导数，首个非零项出现在更高阶，从而得到指数 $7/9$。

**排序理由**

正文核查显示该文围绕“结构稳定尖点的局部正则性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 88/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 摘要、正文第 1--4 节、文末 Conflict of interest statement、Data availability statement、Acknowledgments 和 References 前后的全部末尾区域。文末仅说明无利益冲突、未使用数据以及基金资助，未出现 AI、LLM 或相关工具声明。

**原始英文摘要**

In this paper, we study two families of quasilinear equations: Hunter-Saxton type and Camassa-Hom type equations, with a paramerter $\\lambda\\in\(0,1\)$ whose solutions form cusp singularities\. When $\\lambda=1$, the first system becomes the scalar conservation law\. The main result of this paper is to give regularity of two types of structurally stable singularities: Type I on the singular curve, Type II at the point where cusp singularity forms, for some $\\lambda\\in\(0,1\)$\. When $\\lambda\\rightarrow 1$, our result indicts the $C^\{1/3\}$ regularity at the point where singularity forms, which agrees with the regularity of the generic pre-shock solution\.

---

#### Stable determination of coefficients for the nonlinear third-order acoustic equations

- **作者：** Song-Ren Fu、Dong Qiu、Tianyi Zheng、Ting Zhou
- **arXiv：** [2609\.12974](https://arxiv.org/abs/2609.12974) · [PDF](https://arxiv.org/pdf/2609.12974)
- **分类：** math\.AP
- **进展类型：** 稳定系数反演
- **阅读优先级：** 86/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究广义 Jordan--Moore--Gibson--Thompson 方程中空间变系数的边界反演。对已知正系数 $b$、满足严格凸边界与叶状条件的区域，作者利用小 Dirichlet 数据对应的 DN 映射，同时稳定恢复阻尼系数 $\\alpha$、低阶系数 $\\lambda$、势系数 $q$ 及非线性系数 $\\xi$；前者在黎曼度量下通过光线变换恢复，后者在 $b$ 为正常数时通过欧氏加权光线变换恢复。

**使用技术**

- 将 $b^\{-1\}ds^2$ 视为区域上的黎曼度量，以严格凸叶状条件保证非捕获性、有限测地线长度及测地光线变换的稳定可逆性。
- 通过兼容性条件、局部时间分片和 Banach 不动点定理建立线性及小数据非线性 JMGT 初边值问题的高阶适定性。
- 沿 Lorentz 度量 $-dt^2\+g$ 的零测地线构造 Gaussian beam：用 Fermi 坐标求解 eikonal 方程和 Riccati 方程，再递归求解振幅输运方程并估计余项。
- 对非线性 DN 映射作一阶和二阶有限差分展开，结合伴随方程的分部积分得到包含系数差的 Alessandrini 型积分恒等式。
- 将高频主项集中到中心测地线，先恢复 $\\alpha$、再恢复 $\\lambda$ 和 $q$；恢复 $\\xi$ 时在 $b$ 为正常数条件下改用平面 GO 解及加权欧氏 $X$ 射线变换。

**可能的突破**

核心贡献是在空间变系数、三阶时间 JMGT 模型和二次非线性同时存在时，建立四个系数的 Hölder 型稳定恢复。证明链把高频 Gaussian beam 的横向集中、严格凸几何下的测地光线变换稳定性、非线性有限差分线性化及逐项吸收估计组合起来；特别是用二阶线性化隔离 $\\xi$，并通过均匀处理掠入射测地线避免稳定性常数随入射角退化。

**限制与不确定性**

结论要求 $n\\ge3$、光滑严格凸边界、叶状条件和 $T&gt;\\operatorname\{diam\}\_g\\Omega$，并要求系数属于给定高阶 $C^K$ 有界类及边界数据足够小。系数 $b$ 始终假定已知；$\\xi$ 的稳定恢复进一步限于 $b$ 为正正常数，空间变 $b$ 时相应估计仍未知。稳定指数未显式给出且作者指出并非最优；仅处理完整边界测量，部分边界数据和恢复 $b$ 的问题留待以后。

**证明逻辑/大纲**

1. **主张：** 线性问题和小数据非线性问题具有满足高阶估计的唯一解。
   - **路线：** 先将三阶算子拆为主部 $P\_0$ 与低阶扰动 $B=\\lambda\\partial\_t\+q$。兼容性递推确定所有初始时间 jet，Lemma 3\.2 给出 $P\_0$ 的局部能量型 Sobolev 估计；在长度足够小的时间片上，映射 $v\\mapsto\\Phi\(v\)$ 的扰动范数被 $C M\_0\\tau$ 控制，选取 $\\tau$ 使其小于一后用 Banach 不动点，再逐片延拓到 $\[0,T\]$。对右端为 $\\partial\_t^2\(\\xi u^2\)$ 的非线性项，在高阶 Banach 代数中同样得到小边界数据球内的压缩映射。
2. **主张：** 沿零测地线构造具有可控余项的前向和伴随 Gaussian beam。
   - **路线：** 在 Fermi 坐标中取 $v\_\\sigma=e^\{i\\sigma\\phi\}a\_\\sigma\+r\_\\sigma$，令相位的横向 Taylor 系数满足 eikonal 消去条件 $\(4\.2\)$。二次相位矩阵 $H$ 满足 Riccati 方程 $\(4\.9\)$，由 $\\operatorname\{Im\}H&gt;0$ 保证横向高斯衰减；随后按频率次序和横向次数递归解输运方程 $\(4\.3\)$--$\(4\.4\)$。把截断近似代回方程后，对余项解应用线性适定性估计，得到 $r\_\\sigma$ 和伴随余项的高频衰减。
3. **主张：** 非线性 DN 映射的一阶、二阶有限差分产生可用于分离系数的积分恒等式。
   - **路线：** 对边界数据 $\\varepsilon\_1f\_1\+\\varepsilon\_2f\_2$ 的解作有限差分，Lemma 5\.1 将解展开为线性项 $v\_j$、二阶项 $w\_\{kl\}$ 和分别为 $O\(\\rho\_\\varepsilon^2\)$、$O\(\\rho\_\\varepsilon^3\)$ 的余项。比较两组系数的一阶线性化解，令其差与伴随解 $y$ 配对并分部积分，得到 $\(5\.8\)$ 中关于 $\\widetilde\\alpha,\\widetilde\\lambda,\\widetilde q$ 的 Alessandrini 恒等式；二阶混合差分同理得到 $\(5\.11\)$，其中主项为 $\\widetilde\\xi\(\\partial\_t^2y\)\(\\partial\_tv\_2\)v\_2$。
4. **主张：** Gaussian beam 主项和测地光线变换逐级恢复 $\\alpha$、$\\lambda$ 与 $q$。
   - **路线：** 将前向和伴随 Gaussian beam 代入 $\(5\.8\)$，横向高斯集中后得到三个主矩 $\(6\.14\)$--$\(6\.16\)$，分别对应带权的 $\\alpha$、$\\lambda$、$q$ 测地线积分。先利用 $I\_\{\\widetilde\\alpha,\\widetilde\\lambda,\\widetilde q\}$ 的高频估计和参数选择控制 $I\(\\widetilde\\alpha\)$，再用稳定光线变换及插值得到 $\\\|\\widetilde\\alpha\\\|\_\{L^\\infty\}$；把该界代回第二个主矩恢复 $\\widetilde\\lambda$，再代回第三个主矩恢复 $\\widetilde q$。Lemma 6\.1 将测地线分为非掠入射族和小测度掠入射族，统一高斯集中误差并完成全射线 $L^2$ 控制。
5. **主张：** 当 $b$ 为正正常数时，二阶 GO 恒等式经加权欧氏光线变换恢复非线性系数 $\\xi$。
   - **路线：** 取平面相位 $\\varphi\_\\omega=t\+x\\cdot\\omega/\\sqrt b$，按 $\(6\.35\)$--$\(6\.36\)$ 递归构造前向和伴随 GO 振幅，并用 Lemma 6\.2 保证所有入射方向的初末兼容条件和余项估计一致。将这些解代入 $\(5\.11\)$，先以 $\(6\.34\)$ 已获得的线性系数界吸收低阶项，再选择频率 $\\sigma$、束宽 $\\ell$ 和振幅 $\\varepsilon$，得到 $\(6\.53\)$ 的主积分估计。将其识别为带光滑非零权 $W$ 的欧氏 $X$ 射线变换 $\(6\.55\)$，应用加权光线变换稳定性和插值得到 $\\\|\\widetilde\\xi\\\|\_\{L^\\infty\}$，从而闭合 Theorem 1\.2。

**排序理由**

正文核查显示该文围绕“稳定系数反演”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 86/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--41 页全文，包括摘要、引言、全部主定理、Sections 2--7、附录、Acknowledgments、Statements and Declarations、Data availability statement、Conflict of Interests、References 及正文末尾；未发现作者明确披露 AI、LLM、软件或工具用于研究、证明、写作、代码、编辑、校对、翻译、排版、图表或插图。Acknowledgments（PDF 第 39 页）仅列出基金资助，数据声明称未生成或分析数据，利益冲突声明称无利益冲突。

**原始英文摘要**

In this paper, we study an inverse boundary value problem for a generalized Jordan-Moore-Gibson-Thompson equation with Westervelt-type nonlinearity and space-dependent coefficients\. This third-order \(in time\) hyperbolic equation models nonlinear ultrasound propagation in viscous and thermally relaxing media\. Assuming that the diffusivity and the sound speed are known a priori, we investigate the simultaneous stable determination of the friction coefficient, the weak damping coefficient, the potential, and the nonlinear coefficient from the associated Dirichlet-to-Neumann map\. The proof combines the finite-difference linearization method with the construction of Gaussian beam and geometric optics solutions\. These arguments reduce the inverse problem to stability estimates for \(attenuated\) geodesic ray transforms under the foliation condition\. As a consequence, we obtain H\\"older-type stability estimates of recovering the linear and nonlinear coefficients\.

---

#### Internal controllability of first order quasilinear hyperbolic systems with a reduced number of controls

- **作者：** Fatiha Alabau-Boussouira、Jean-Michel Coron、Guillaume Olive
- **arXiv：** [2609\.12490](https://arxiv.org/abs/2609.12490) · [PDF](https://arxiv.org/pdf/2609.12490)
- **分类：** math\.OC、math\.AP
- **进展类型：** 内部精确可控性
- **阅读优先级：** 84/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究一维一阶拟线性双曲系统在内部控制数少于方程数时的精确可控性。对于同速线性系统，作者沿延拓特征线把问题化为带支集约束的参数化常微分方程，并给出由控制时间和 Gramian 可逆性组成的充要条件；对于半线性系统，线性化可控性通过 Banach 不动点推广。对于异速拟线性系统，作者在一个 $2\\times2$ 对角速度系统中用两个虚拟控制、代数可解性和 Gromov 型 Nash--Moser 不动点定理消除一个控制，证明零轨道附近的局部内部精确可控性。

**使用技术**

- 用延拓特征线描述周期边界下的传播，把线性双曲系统分解为相互独立的带时间支集约束的 ODE；用 resolvent 构造控制 Gramian，并通过其可逆性刻画每条特征线上的可控性。
- 在控制区域附近构造平滑截断，证明约束 Gramian 可在所有特征线上一致保持可逆；再沿特征线写出显式控制，将终端误差乘以 Gramian 逆并拼接回原周期区域。
- 对同速半线性系统在给定轨道处线性化，先以线性精确可控性提供右逆，再将非线性余项作为小扰动，使用 Banach 不动点定理获得局部精确可控性。
- 对异速 $2\\times2$ 拟线性系统先引入第二个虚拟控制并用延拓区域和边界可控性构造小控制；随后把 PDE 写成非线性微分算子 $D$，在非退化微分关系上显式构造一阶 infinitesimal inversion。
- 应用 Gromov 的 Nash--Moser 型固定点定理处理一个导数损失：局部性和归一化性质保证 Nash--Moser 产生的解能与虚拟控制解及无控制解在控制区域边界处匹配，并通过截断得到单一内部控制。

**可能的突破**

核心进展是将减少控制数的内部精确可控性推进到异速拟线性双曲系统。在线性同速情形给出完整的特征线和 Gramian 充要判据；在拟线性异速情形，条件 $\\partial f\_2/\\partial y\_1\(0\)\\ne0$ 使线性化算子可代数求逆，作者据此结合虚拟控制和 Gromov--Nash--Moser 方法克服标准固定点因导数损失失效的问题，证明一个控制可控两个方程的 $2\\times2$ 系统在零轨道附近可局部精确控制。

**限制与不确定性**

拟线性主定理仅处理一维周期区域中的 $2\\times2$ 对角异速系统、一个内部控制和零轨道附近的小初末数据；需要速度非零且严格有序、耦合非退化条件 $\\partial f\_2/\\partial y\_1\(0\)\\ne0$，并满足显式控制时间下界。初末数据要求 $C^6$，而控制和所得解仅保证 $C^1$，作者指出该正则性可能不是最优且存在导数损失。对于 $n&gt;2$，代数可解性会明显复杂，本文未处理；也未给出任意拟线性轨道、非周期边界、较少于 $n-1$ 控制或全局大数据可控性。半线性结论依赖相应线性化系统的精确可控性。

**证明逻辑/大纲**

1. **主张：** 同速线性系统的内部精确可控性等价于特征线覆盖条件和每条特征线 ODE 的支集约束可控性。
   - **路线：** 沿延拓特征线 $X\(t,x\)$ 将 PDE 写成参数为初始位置 $x$ 的 ODE $\(2\.4\)$，控制支集转化为时间区间约束 $\(2\.5\)$。充分性先用 Lemma 2\.6 对每条特征线的 Gramian 作一致截断，使其仍可逆，再由式 $\(2\.13\)$ 构造 ODE 控制，并用式 $\(2\.14\)$ 沿逆特征线拼回平滑周期控制；必要性分别选取穿过控制区之外的特征线排除时间不足，并用常值初末数据把 PDE 控制限制到每条特征线的 ODE。
2. **主张：** 带控制支集约束的 ODE Gramian 提供可检验的代数判据，并推出同速半线性系统的局部可控性。
   - **路线：** 对带多个时间区间约束的线性 ODE，Proposition 2\.3 用 Gramian 可逆性给出充要条件；常系数时化为 Kalman 型矩阵秩条件 $\(2\.10\)$，变系数时由 Proposition 2\.5 的某个控制时刻满秩条件保证可控。对半线性系统沿给定轨道线性化，Theorem 2\.9 将线性控制产生的右逆与二阶非线性余项组合，在小邻域内用 Banach 不动点求出保持支集约束的精确控制。
3. **主张：** 为异速拟线性系统构造两个虚拟控制，并把控制支集压缩到严格内部。
   - **路线：** 先在延拓空间区间上使用已有的全控制边界可控性结果，得到两个控制的系统；再用前向和后向无控制解、时间截断与空间截断在周期域中拼接，定义式 $\(3\.12\)$ 的残差控制。支集和端点消失条件由式 $\(3\.13\)$ 保证，随后在时间端点外自由演化，使控制延拓为零并获得式 $\(3\.5a\)$ 的严格内部支集，同时保持小 $C^1$ 范数。
4. **主张：** 代数可解性与 Gromov Nash--Moser 反演消除一个控制并闭合 Theorem 3\.1。
   - **路线：** 令 $D\(y,\\Theta\)=y\_t\+\\Lambda\(y\)y\_x\+f\(y\)-e\_1\\Theta$，在系数 $a\_\{21\}\\ne0$ 的开微分关系上考察其线性化。通过设置 $v=0$、$u=g\_2/a\_\{21\}$ 并按式 $\(3\.24\)$ 定义 $\\Theta$，Proposition 3\.6 构造一阶 infinitesimal inversion。对两个虚拟控制产生的扰动应用 Gromov Theorem 3\.5，得到带导数损失但具有局部性和归一化性质的非线性逆；在控制区内部使用该逆，在外部与虚拟控制轨道匹配，最后按式 $\(3\.29\)$ 和分片定义得到单一控制、目标终态及小性估计。

**排序理由**

正文核查显示该文围绕“内部精确可控性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 84/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--25 页全文，包括摘要、引言、Section 2、Section 3、附录证明、全部定理与公式、参考文献及正文末尾；检索了致谢、AI、LLM、ChatGPT、软件、代码、工具、编辑、校对、翻译、排版和图表声明。未发现作者明确披露 AI 或相关工具用于研究、证明、写作或其他列举用途。PDF 第 1 页的脚注仅说明部分作者获得 ERC 项目资助，正文末尾为参考文献，无独立致谢或 AI 声明。

**原始英文摘要**

In this paper we investigate the exact controllability of $n \\times n$ first order one-dimensional quasilinear hyperbolic systems by $m&lt;n$ internal controls that are localized in space in some part of the domain\. We distinguish two situations\. The first one is when the equations of the system have the same speed\. In this case, we can use the method of characteristics and obtain a simple and complete characterization for linear systems\. Thanks to a linear test this also provides some sufficient conditions for the local exact controllability around the trajectories of semilinear systems\. However, when the speed of the equations are not anymore the same, we see that we encounter the problem of loss of derivatives if we try to control quasilinear systems with a reduced number of controls\. To solve this problem, as in a prior article by J\.-M\. Coron and P\. Lissy on a Navier-Stokes control system, we first use the notion of algebraic solvability due to M\. Gromov\. However, in contrast with this prior article where a standard fixed point argument could be used to treat the nonlinearities, we use here a fixed point theorem of Nash-Moser type due to M\. Gromov in order to handle the problem of loss of derivatives\.

---

#### Sobolev Regularity in Mixed and Isotropic Scales for Vector Fields on the Torus

- **作者：** Fernando de Ávila Silva、Alexandre Kirilov、André Pedroso Kowacs
- **arXiv：** [2609\.12207](https://arxiv.org/abs/2609.12207) · [PDF](https://arxiv.org/pdf/2609.12207)
- **分类：** math\.AP
- **进展类型：** 新结果/混合与各向同性正则性
- **阅读优先级：** 77/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文系统研究二维环面上一阶向量场的方向性正则性。对常系数算子，在非实系数情形得到一阶导数可在两个方向间分配的混合 Sobolev 增益；对实无理系数得到由无理测度控制的损失。对实值变系数，直接 Fourier 模态法给出带额外损失的混合正则性，而周期正规形共轭保持各向同性阶数并转移到 $H^\{s\+1-r\}$ 正则性、存在性、唯一性和经典正则性。

**使用技术**

- 对常系数方程作全 Fourier 变换，把问题化为符号 $\\tau-c\\xi$ 的乘子估计，并显式识别共振集。
- 用无理测度 $\\mu\(a\)$ 给出小除数下界，再以两个端点估计的加权几何平均获得参数 $\\theta$ 区间内的统一乘子界。
- 在混合 Sobolev 范数中对 Fourier 系数加权求和，并通过整数阶归纳、插值和负阶对偶处理任意实阶正则性。
- 对变系数算子作 $x$ 方向部分 Fourier 变换，利用周期一阶常微分方程的积分因子表示、Carleson 型小除数控制和零模兼容条件估计各频率。
- 构造周期相位 $A\(t\)$ 的正规形共轭 $\\Psi\_\{\\pm A\}$，用相位乘子的混合空间估计和各向同性 Sobolev 自动同构比较两种方法。

**可能的突破**

论文把常系数与实值变系数向量场的正则性统一到混合 Sobolev 标度中，明确刻画导数增益或损失在两个变量间的可分配区域；对实无理系数还证明了无理测度阈值以下的尖锐性以及有理、Liouville 情形的障碍。对变系数，直接模态法保留方向信息，正规形共轭则恢复各向同性最优阶数 $s\+1-r$，从而同时给出正则性、可解性、唯一性和经典连续性结论。

**限制与不确定性**

实无理情形的估计通常只对 $r&gt;\\mu\(a\)$ 成立，端点 $r=\\mu\(a\)$ 需要额外的 Diophantine 下界，不能由无理测度数值单独推出。直接变系数模态法在负的第一混合阶数下引入 $\|q\|$ 型额外损失，经过正规形共轭得到的混合区域一般更小，优势主要体现在各向同性标度。文章假设系数属于 $C^\\infty$；Remark 6\.4 说明有限光滑度版本可得但未优化其精确假设。

**证明逻辑/大纲**

1. **主张：** 建立全 Fourier 与部分 Fourier 约化，并得到常系数和变系数共同需要的小除数估计。
   - **路线：** 常系数方程先化为 $i\(\\tau-c\\xi\)\\widehat u\(\\tau,\\xi\)=\\widehat f\(\\tau,\\xi\)$，由共振集分析确定零模兼容条件；非实系数通过可逆实线性映射得到椭圆型下界，实无理系数则由无理测度得到端点估计并取加权几何平均。变系数方程在非零 $x$ 频率下化为周期一阶常微分方程，积分因子表示把分母归结为 $1-e^\{\\pm2\\pi i\\xi a\_0\}$。
2. **主张：** 由符号乘子下界推出常系数向量场的混合正则性、定量估计及归一化后的存在唯一性。
   - **路线：** 令 $v=u-\\widehat u\(0,0\)$，在非共振频率上写成 $\\widehat v=\\widehat f/\[i\(\\tau-c\\xi\)\]$；将 Proposition 3\.3 的乘子下界与 $\\langle\\tau\\rangle^\{k\_1\}\\langle\\xi\\rangle^\{k\_2\}$ 权重相乘，平方求和后得到非实系数的 $\(\\theta,1-\\theta\)$ 一阶增益，以及实无理系数的 $\(\\theta,1-r-\\theta\)$ 净移位。零均值条件和零模归一化随后给出分布解的存在与唯一性。
3. **主张：** 证明参数范围和算术阈值的尖锐性，并构造有理与 Liouville 情形的反例。
   - **路线：** 先把频率限制在坐标轴上，强制乘子估计中的 $\\theta$ 端点范围；当 $r&lt;\\mu\(a\)$ 时选取极小的 $\|\\tau\_j-a\\xi\_j\|$，定义稀疏 Fourier 系数使右端仍在给定混合空间而解的目标空间级数发散。有理系数利用无穷共振频率构造非零齐次核，Liouville 系数则利用超多项式小除数构造光滑右端但不具目标正则性的解。
4. **主张：** 通过逐频率周期方程估计得到实值变系数的混合正则性和可解性。
   - **路线：** 对每个非零 $\\xi$，先用积分表示得到 $L^2$ 基础估计，再对方程反复微分建立整数阶估计；插值覆盖非负实阶，利用算子形式伴随和对偶覆盖负阶，最后对所有 $\\xi$ 按混合 Fourier 权重求和。零频率单独由一维原函数处理，条件 $\\widehat f\(0,0\)=0$ 保证周期性，得到 Theorem 5\.2 的 $\|q\|$ 额外损失及 Corollary 5\.3 的唯一解。
5. **主张：** 以周期正规形共轭转移常系数结果，并区分混合标度损失与各向同性标度保持。
   - **路线：** 定义 $A\(t\)=\\int\_0^t\(a\(\\sigma\)-a\_0\)\\,d\\sigma$，利用零均值证明其周期性，并由链式法则得到 $\\Psi\_A L=L\_0\\Psi\_A$。Fourier 相位 $e^\{\\mp i\\xi A\(t\)\}$ 在混合空间中损失第一阶指数的 $\|s\_1\|$，形成 Theorem 6\.5；但在各向同性 $H^s$ 中，坐标变换是有界自动同构，于是把常系数的 $s\+1-r$ 结论转移给变系数，并进一步转移尖锐性和有理、Liouville 障碍。

**排序理由**

正文核查显示该文围绕“新结果/混合与各向同性正则性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 77/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--33 页全文，包括摘要、引言、第 2--6 节全部定理与证明、Acknowledgments、References 及正文末尾作者信息；未见作者明确披露 AI、LLM、软件或工具用于研究、证明、写作、代码、编辑、校对、翻译、排版、图表或插图。Acknowledgments（PDF 第 31 页）仅列出 CNPq 与 FAPESP 资助。

**原始英文摘要**

We study regularity, existence, and uniqueness of solutions to vector fields on the two-dimensional torus in Sobolev spaces of dominating mixed smoothness, which measure regularity separately in the two variables\. For constant-coefficient vector fields, we obtain families of mixed smoothness estimates describing how the gain or loss of regularity can be distributed between the two variables\. In the nonreal case, a gain of one derivative can be distributed between the two directions, whereas for real irrational coefficients the loss is governed by the irrationality measure of the coefficient\. We also establish sharpness below the corresponding arithmetic threshold and describe the rational and Liouville obstructions\. For real-valued variable coefficients, direct estimates for the periodic Fourier-mode equations yield mixed smoothness regularity results and their isotropic and classical consequences\. We then use a periodic conjugation to the averaged constant-coefficient normal form\. Although this conjugation introduces an additional loss in the mixed smoothness scale, it preserves isotropic Sobolev orders and therefore transfers the sharp constant-coefficient isotropic theory to the variable-coefficient setting\. In the nonresonant regimes, we also obtain existence and uniqueness under the natural zero-mean compatibility condition\.

---

### 其他分析方向

#### Trace formulas for TBG

- **作者：** Henry Zeng
- **arXiv：** [2609\.13080](https://arxiv.org/abs/2609.13080) · [PDF](https://arxiv.org/pdf/2609.13080)
- **分类：** math-ph、math\.AP、math\.SP
- **进展类型：** TBG 魔角逆幂和的迹公式
- **阅读优先级：** 72/100 · 中优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文将 Becker 等人关于手性扭转双层石墨烯模型中魔角逆四次幂和的公式推广到一类有限 Fourier 模式势函数。作者先把魔角刻画为紧算子 $T\_k$ 的逆特征值，再将 $T\_k^\{2p\}$ 的迹与魔角的代数重数联系起来。对 $p=2$，通过 Fourier 基上的算子展开、周期晶格求和和留数计算，得到主迹公式。

**使用技术**

- 手性 TBG Dirac 算子
- 晶格与旋转对称性
- 紧算子谱与代数重数
- Hilbert--Schmidt 算子和 Lidskii 定理
- Fourier 基展开
- 乘法算子 $J\_a$ 与对角算子 $D\_a$ 的换序关系
- 迹对晶格参数的不变性
- 亚纯函数和三角形轮廓积分
- 留数定理
- 有限 Fourier 模式下的组合分类

**可能的突破**

对满足对称性且形如 $U\(z\)=\\sum\_\{n\\in1\+3\\mathbb Z\}c\_nU\_\{nK\}\(z\)$ 的势函数，论文证明魔角集合 $\\mathcal A$ 满足 $\\sum\_\{\\alpha\\in\\mathcal A\}\\alpha^\{-4\}=\\frac\{8\\sqrt\{3\}\\pi\}\{K^4\}\\sum\_\{n,m\}\\frac\{c\_n^2c\_m^2\+2c\_n^2c\_mc\_\{-n-m\}\}\{n^2\+nm\+m^2\}$，其中按代数重数计数。核心贡献是把一般势的迹问题化为 Fourier 算子乘积的晶格对角元，再用留数公式消除晶格求和，最后通过五类指标配置完成 $p=2$ 的显式化简。

**限制与不确定性**

结果只覆盖有限 Fourier 模式且系数索引限制在 $1\+3\\mathbb Z$ 的势函数子类，不能直接处理一般满足旋转和准周期对称性的无限模式势。留数计算的显式公式只针对 $p=2$；更高逆幂迹的统一闭式表达未在本文中给出。论文依赖既有的魔角谱刻画、迹类性质和留数公式，未重新建立相关模型的全部谱理论。

**证明逻辑/大纲**

1. **主张：** 第 2 节把魔角与紧算子 $T\_k$ 的谱联系起来，并把魔角逆幂和写成迹。
   - **路线：** 利用 Fourier 共轭关系（2\.1）将 $D\(\\alpha\)$ 平移到固定 Floquet 空间，因而在 $k\\notin\\\{K,-K\\\}\+\\Lambda^\*$ 时分解为 $\(2D\_\{\\bar z\}\+k\)\(1\+\\alpha T\_k\)$。由谱等价关系（2\.3），魔角满足 $-1/\\alpha\\in\\operatorname\{Spec\}\(T\_k\)$；再将 $T\_k^2$ 分块为 $T\_k^\+$ 与 $T\_k^-$，定义 Hilbert--Schmidt 算子 $A\_k$，由 Lidskii 定理得到 $\\operatorname\{tr\}\(A\_k^p\)=\\frac12\\sum\_\{\\alpha\\in\\mathcal A\}\\alpha^\{-2p\}$。
2. **主张：** 第 3\.1 节在 Fourier 基上展开 $A\_k^p$，并筛选出对迹有贡献的晶格闭合项。
   - **路线：** 在 $L^2\_\{-K\}$ 的正交基 $e\_l$ 上计算迹，引入对角算子 $D\_a$ 和平移算子 $J\_a$。换序关系 $J\_aD\_b=D\_\{a\+b\}J\_a$ 以及 $J\_aJ\_b=J\_\{a\+b\}$ 将每个算子乘积重排为对角因子和总晶格平移。只有总平移为零的指标组 $\\Theta\_p$ 对角元不消失，于是公式（3\.13）--（3\.14）把迹化为有限指标求和及有理函数分母。
3. **主张：** 第 3\.2 节用亚纯性和三角形轮廓积分把晶格迹表示成留数和。
   - **路线：** 固定 Fourier 基向量定义 $f\(k\)=\\langle A\_k^pe\_\{-K\},e\_\{-K\}\\rangle$，由（3\.14）知其为仅有有限极点的亚纯函数且在无穷远按 $O\(k^\{-2p\}\)$ 衰减。迹对 $k$ 的平移不变性给出晶格平移和（3\.17）；另一方面，对每个晶格极点周围的三角形应用留数定理，将轮廓积分配对并利用绝对收敛，得到 $\\tau\_p=-\\frac\{\\sqrt\{3\}\}\{8\\pi\}\\sum\_\{b\\in\\\{ -K,K\\\}\+\\Lambda^\*\}b\\operatorname\{Res\}\(f,b\)$。
4. **主张：** 第 3\.3 节对 $p=2$ 的五类 Fourier 指标配置逐项求留数，得到引言中的主公式。
   - **路线：** 将（3\.24）中的指标按旋转指数和晶格闭合条件分成五类，利用旋转对称性说明不同旋转参数给出相同项，只需计算一个代表并乘以 $3$。对每组有理函数先减去总留数为零的辅助项，使非零晶格极点相互抵消；剩余极点在 $z=0$ 的留数经直接化简后合并为 $c\_n^2c\_m^2$ 与 $c\_n^2c\_mc\_\{-n-m\}$ 两类贡献，得到所述 $n^2\+nm\+m^2$ 分母的迹公式。

**排序理由**

正文核查显示该文围绕“TBG 魔角逆幂和的迹公式”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 72/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：已核查 PDF 第 1--8 页正文、证明和 Acknowledgements，以及第 9 页末尾；PDF 第 8 页致谢仅包含人工致谢和基金信息，未见 AI 或工具声明。

**原始英文摘要**

Becker et al\. produced a striking trace formula for the sum of fourth powers of generalized magic angles, $ \\theta $, for the chiral model of twisted bilayer graphene \(TBG\) with the exact Bistritzer--MacDonald potential: $\\sum \\theta^\{4\} = 8 \\pi / \\sqrt 3 $\. The purpose of this note is to generalize this formula to a larger class of potentials satisfying the symmetries of the model\.

---

#### Score-based Outlier Generation via Controlling the Radon-Nikodym Derivative

- **作者：** Amartya Mukherjee、Tristan Milne、Kry Yik-Chau Lui、Stephanie Hazlewood、Jun Liu
- **arXiv：** [2609\.12113](https://arxiv.org/abs/2609.12113) · [PDF](https://arxiv.org/pdf/2609.12113)
- **分类：** cs\.LG、math\.AP、math\.OC、math\.PR、stat\.ML
- **进展类型：** 基于似然分布控制的扩散模型异常样本生成
- **阅读优先级：** 55/100 · 中优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--8 页。论文把异常样本定义为对数似然推前测度的分布性下移：目标测度在一阶随机占优下移向低似然区，并以 Wasserstein 距离量化幅度。作者证明似然重加权的 Radon--Nikodym 导数只依赖似然值，从而使分数函数获得标量乘法控制；再利用 Ornstein--Uhlenbeck 半群的指数收敛，以无需重新训练的指数衰减控制近似真实控制，并在高斯混合与 CIFAR-10 上验证。

**使用技术**

- 对数似然推前测度、一阶随机占优与 Wasserstein 距离异常定义
- 条件分解与 Radon--Nikodym 导数的测度重加权
- Fokker--Planck 方程、对数密度方程与分数函数链式法则
- Ornstein--Uhlenbeck 半群、Hermite 谱展开与指数收敛
- 概率流常微分方程的似然依赖控制与无重训练采样
- 高斯混合闭式分数、经验分布检验与 CIFAR-10 实验

**可能的突破**

核心进展是把异常样本从单点启发式判据提升为对数似然分布的可控偏移，并由条件保持的似然重加权严格推出 $d\\nu/d\\mu=z\(l\(x\)\)$ 及分数缩放 $\\nabla\\log q=\[1\+c\(l\)\]\\nabla\\log p$。这给出只修改概率流 ODE、无需重新训练扩散模型的控制机制；Ornstein--Uhlenbeck 的 Hermite 谱收敛进一步支持用 $e^\{-t\}c\_0$ 近似真实时变控制，实验显示可按指定幅度把样本推向低似然区域且保持数据几何结构。

**限制与不确定性**

理论要求概率密度及对数密度足够光滑，目标似然测度满足绝对连续性，且 Theorem 3--5 还依赖密度比下界、控制系数时间 Lipschitz、不同似然测度间范数等价等假设；真实控制 $c\_t$ 依赖时变似然分布的 Radon--Nikodym 导数，实际方法用指数插值和近似分布，控制误差只在列出的范数条件下估计。理论没有分析神经网络分数的逼近误差、概率流数值积分误差、离散高维似然估计或目标分布不可微情形。实验仅覆盖可解析高斯混合和一个预训练 CIFAR-10 模型，以经验一阶随机占优和 Wasserstein 距离验证，未给出跨数据集、异常语义质量或安全性保证；方法控制的是似然分布而非特定个体异常。

**证明逻辑/大纲**

1. **主张：** 在似然值的推前测度上形式化分布性异常。
   - **路线：** 将数据测度 $\\mu$ 通过 $l\(x\)=\\log p\(x\)$ 推前为 $L=l\_\\\#\\mu$，用一阶随机占优 $\\eta\\le\_\{st\}L$ 表示目标向低似然方向移动，并用一维分位数表示的 $W\_1\(L,\\eta\)$ 规定异常幅度 $\\rho$；条件分解保持给定似然水平内的数据结构。
2. **主张：** 证明似然重加权导出精确的 Radon--Nikodym 结构和分数控制。
   - **路线：** 令 $z=d\\eta/dL$，对条件分解积分应用测度分解定理，得到 $d\\nu/d\\mu=z\(l\(x\)\)$；再对 $q=pz\(l\)$ 取空间梯度，链式法则把重加权影响压缩为沿原分数方向的标量因子 $1\+c\(l\)$，由 Corollary 2 写成受控概率流 ODE。
3. **主张：** 用 OU 半群收敛构造无需重训练的指数控制近似并给出误差界。
   - **路线：** 把密度比 $h\_t=d\\mu\_t/d\\gamma$ 写成 $g\_t=h\_t-1$，由 Fokker--Planck 方程得到 OU 方程 \(13\)，再用 Hermite 特征展开证明 $L^2$ 和梯度范数以 $e^\{-t\}$ 收敛到高斯平衡。对满足 Theorem 4 条件的目标族取 $\\widetilde c\_t=e^\{-t\}c\_0$，结合 Theorem 3 的收敛、下界和范数等价假设控制 $\\widetilde c\_t-c\_t$，得到 Corollary 3 的小时间和大时间误差 $O\(\\min\(t,e^\{-t\}\)\)$。
4. **主张：** 在合成与图像扩散实验中检验低似然引导效果。
   - **路线：** 对双高斯混合利用闭式分数 $\\nabla\\log p\_t=\\tanh\(m\_t\\cdot x\)m\_t-x$ 直接求解概率流 ODE，并用抽样的似然推前分布检验一阶随机占优及目标 $W\_1$ 位移；对预训练 CIFAR-10 扩散模型用反向概率流 ODE 估计参考似然分布，改变 $\\rho$ 观察似然分布位移、经验 Wasserstein 距离和视觉结构保持。

**排序理由**

正文核查显示该文围绕“基于似然分布控制的扩散模型异常样本生成”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 55/100。

**AI 声明核查**

已核查未见 AI 披露。

检查范围：论文 PDF 全文逐页核查（第 1--8 页），包括第 1 页资助脚注、正文末尾 Conclusion、References 及实验部分；未见 Acknowledgments 或 AI/LLM 使用声明，并执行相关关键词检索。

**原始英文摘要**

Outliers are important for stress-testing algorithms and understanding system behaviour under rare conditions\. Despite being commonly described as low-likelihood events, existing generative approaches rarely control likelihood explicitly\. In this work, we introduce a measure-theoretic notion of outliers based on the distribution of log-likelihood values, which is guaranteed to assign higher probability mass to low-likelihood events with a specifiable magnitude\. Building on this formulation, we derive how likelihood reweighting modifies the diffusion score and use this relation to motivate a controlled modification of the reverse-time dynamics\. In particular, likelihood reweighting implies a scaling of the score function with a control term derived from the Radon-Nikodym derivative of the likelihood distributions\. Correspondingly, the updated score function can be obtained with no retraining of the diffusion model\. We exploit the Ornstein-Uhlenbeck semigroup underlying diffusion models to motivate an exponentially interpolated controller which approximates the true control\. Experiments demonstrate controlled generation of low-likelihood samples while remaining consistent with the data geometry\.

---

## 明确披露 AI 使用

### 色散方程

#### On the vortex filament conjecture for the Gross-Pitaevskii equation

- **作者：** Manuel del Pino、Rowan Juneman、Monica Musso、Juncheng Wei
- **arXiv：** [2609\.13078](https://arxiv.org/abs/2609.13078) · [PDF](https://arxiv.org/pdf/2609.13078)
- **分类：** math\.AP、math\.DG
- **进展类型：** Gross--Pitaevskii 方程涡旋丝极限构造
- **阅读优先级：** 97/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--137 页。论文对任意给定的光滑嵌入闭合双法向流曲线，在小核尺度 $\\varepsilon\\to0$ 下构造 Gross--Pitaevskii 方程的光滑有限能量精确解，使度为一的涡旋丝在 Hausdorff 距离下以 $O\(\|\\log\\varepsilon\|^\{-1\}\)$ 收敛到给定曲线；近丝处收敛到平面标准涡旋剖面，远场相位梯度收敛到 Biot--Savart 场，并给出含有限部非局部项的精细调制方程。

**使用技术**

- Seifert 曲面立体角相位与 Biot--Savart 表示
- 周期管状坐标、移动法向标架、法向图规范与恒速约束
- 平面 Ginzburg--Landau 涡旋线性化算子、傅里叶模态求逆与平移模态可解性条件
- 非局部拟线性 Schrödinger 方程、二阶对数主部的斜自伴性、tame 估计与 Nash--Moser 迭代
- 内外匹配、平面有限批次修正、三维波方程外部相位修正与残差降阶
- 随丝移动的酉变换、平移投影、强制正二次型、Gronwall 不等式与 Banach 不动点收缩

**可能的突破**

核心进展是对一般光滑嵌入闭合双法向流给出 Gross--Pitaevskii 涡旋丝猜想的一种构造性实现，而不局限于圆环、螺旋或小曲率几何。论文先通过平移模态的可解性条件导出带有限部 Biot--Savart 修正的曲线演化方程，再用 Nash--Moser 理论获得全时间区间的修正曲线，借助任意代数阶的内外逼近和线性逆估计构造精确解；最终同时得到涡旋核、零集收敛、远场相位以及更高阶中心曲线误差。

**限制与不确定性**

结论限定于 $\\mathbb\{R\}^3$ 中给定的光滑嵌入闭合单条度为一涡旋丝，并限于双法向流保持光滑和嵌入性的紧时间区间 $\[0,T\]$；不处理曲线交叉、奇性形成、断裂重联、多丝一般相互作用或任意初值的动力学收敛。精确解属于专门构造的有限能量解，结果不等同于所有 Gross--Pitaevskii 解的稳定性、唯一性或涡旋集中定理。证明依赖大量有限阶展开、管状坐标、平移正交条件、Nash--Moser 导数损失控制和小参数阈值，未覆盖有边界或非均匀介质的方程、其他核心度数及超出固定有限正则性指标的统一估计。

**证明逻辑/大纲**

1. **主张：** 构造带全局相位的初始涡旋丝近似并识别首个平移障碍。
   - **路线：** 用 Seifert 曲面的立体角积分定义相位，使 $e^\{i\\phi\}$ 在曲线外单值且法向绕数为一；将平面标准涡旋 $W$ 嵌入管状坐标并用截断得到初始近似，代入 Gross--Pitaevskii 算子后由 $W$ 方程消去主部。对平面线性化算子的两个平移核投影施加可解性条件，得到曲线法向速度必须满足含有限部 Biot--Savart 场的修正方程。
2. **主张：** 解出修正曲线并控制其偏离给定双法向流的大小。
   - **路线：** 把待求曲线写成给定双法向流的法向图 \(4\.8\)，利用恒速约束 \(4\.13\) 消去从属纵向变量；在线性化图方程中，二阶对数主部在复法向结构组合后为斜自伴，从而避免最高阶导数损失，剩余曲率、变系数和对易子满足有限阶 tame 估计。构造 tame 线性逆后应用 Nash--Moser 迭代，闭合 \(4\.86\) 并得到 $O\(\|\\log\\varepsilon\|^\{-1\}\)$ 的曲线控制。
3. **主张：** 通过内外匹配迭代把近似残差降到任意指定代数阶。
   - **路线：** 先在管内用平面线性化算子按角向 Fourier 模态求逆，并选择积分常数同时满足原点正则性、远场匹配和平移矩消失；再把内修正截断，针对产生的外部相位误差解三维波方程并代数确定振幅。第 6 节重复有限批次：每一批用曲线方程线性逆消除主平移项，用平面逆降低剩余内误差，再用外部波修正吸收全局误差，最终得到残差及其初始曲线一阶、二阶导数均为 $O\(\\varepsilon^M\)$。
4. **主张：** 建立线性逆并用收缩映射校正残差，继而证明涡旋丝结论。
   - **路线：** 在全局缩放变量中对精确近似线性化，先用随丝移动的酉变换和相对相位把算子化为时间依赖的实线性椭圆问题；角向分解、平移投影和外内边界通量抵消构造控制平移近零模态的正二次型，微分该能量时利用密度、相位和连续性恒等式的联合抵消，经 Gronwall 得到带固定代数损失的线性估计。再把近似残差和二次非线性放入映射 \(9\.10\)，以 Theorem 3 的高阶残差保证收缩，得到精确解；回到物理变量后用隐函数定理定位唯一零曲线，结合 \(9\.11\)--\(9\.13\)、内外渐近和 Biot--Savart 表示完成 Theorem 1。

**排序理由**

正文核查显示该文围绕“Gross--Pitaevskii 方程涡旋丝极限构造”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 97/100。

**AI 协作披露**

作者在 Acknowledgements 中明确披露在准备该稿件时使用了 OpenAI 工具 GPT 5\.6 和 GPT 6 Astra，具体用途包括稿件组织、表述和部分计算辅助。作者同时声明已审阅完整稿件，并对全部数学陈述和证明承担责任；这表示 AI 协助范围不替代最终数学陈述与证明的作者核查和负责。未进一步说明 AI 是否用于其他代码、校对、翻译、排版、图表或插图任务。

来源：论文 PDF 全文逐页核查（第 1--137 页），覆盖 Overview、Sections 3--9、全部定理证明、正文末尾和 References；Acknowledgements 位于 PDF 第 134 页，明确写出 OpenAI 工具 GPT 5\.6、GPT 6 Astra 及组织、表述、部分计算用途，并声明作者审阅完整稿件且对全部数学陈述和证明负责。

**原始英文摘要**

We establish one form of the vortex filament conjecture for the three-dimensional Gross-Pitaevskii equation\. Given any smooth closed embedded binormal flow of curves on a compact time interval, we construct, in the small-core limit $\\varepsilon\\to0$, a family of exact solutions whose degree-one vortex filaments converge uniformly to the prescribed flow\. Near the filament the solutions have the standard planar vortex profile, while away from it their phase gradients converge to the associated Biot-Savart field\. We also derive a refined modulation law for the vortex filament\.

---

#### The Cauchy problem for Manton's Chern-Simons-Schr\\"odinger equation

- **作者：** Jason Zhao
- **arXiv：** [2609\.13096](https://arxiv.org/abs/2609.13096) · [PDF](https://arxiv.org/pdf/2609.13096)
- **分类：** math\.AP
- **进展类型：** 全局能量适定性
- **阅读优先级：** 96/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究平面上的 Manton Chern--Simons--薛定谔方程。作者在 DeTurck 规范下的自然有限能量空间中证明全局存在、无条件唯一性和数据到解映射的连续依赖，并证明能量与拓扑度守恒；结合此前自对偶涡旋稳定性结果，得到接近自对偶耦合时的轨道稳定性。核心分析是由协变热方程诱导的几何 Littlewood--Paley 理论、抛物平滑、抛物拟微分化和协变 Strichartz 估计。

**使用技术**

- 以协变热方程和 caloric 规范构造规范协变的几何 Littlewood--Paley 分解，把有限能量构型拆成平滑低频部分与可作线性分析的高频部分；引入能量型频率包络刻画跨尺度分布。
- 将 Chern--Simons--薛定谔系统扩展到热参数 $s$，对协变 Hessian 及电磁场、张力场建立抛物方程，形成 paradifferential formulation；在 caloric-temporal 规范中把主方程化为带低频系数的线性电磁 Schrödinger 方程。
- 对光滑解使用协变高阶能量、磁性插值和守恒律，建立控制参数的延拓准则；在线性 paradifferential 方程上交换协变导数，利用低高抛物对易子估计和频率依赖时间片上的经典 Strichartz 估计。
- 对高频协变 Hessian 作频率包络 bootstrap，结合电磁场抛物平滑和协变 Strichartz 界控制 $L\_t^2L\_x^\\infty$，从而在只依赖有限能量与 Gauss 张力的短时间尺度上闭合控制参数。
- 比较两条光滑解的弱 $E^0$ 距离，利用对数型差分估计与非线性 Gronwall--Osgood 论证无条件唯一性；再以光滑近似构造粗糙解，并通过 $H^2$ 规范变换将 caloric-temporal 规范结果连续转回 DeTurck 规范。

**可能的突破**

主要进展是在非线性、规范不变且拓扑非平凡的有限能量空间中完成 Manton Chern--Simons--薛定谔方程的全局适定性。证明链把协变热流提供的频率分解、抛物尺度上的高频线性化、频率包络紧性、弱距离唯一性和规范变换连续性整合起来；同时保留能量和拓扑度守恒。作为推论，在 $\|1-\\lambda\|\\ll1$ 且初始构型接近自对偶涡旋流形时得到轨道稳定性。

**限制与不确定性**

理论针对二维全平面、均匀模型和前向时间的 DeTurck 规范；由于规范中的抛物方程，反向时间问题需要另选规范，未由本文处理。数据到解连续性主要是很弱的 Hölder 型控制，差分估计含对数损失，作者未得到 Lipschitz 流映射。轨道稳定性依赖此前关于自对偶涡旋的稳定性结果，并不等于证明 Manton 猜想所要求的模空间有效常微分方程或长期渐近动力学。部分高阶估计、规范构造和附录中的 Picard 迭代具有较强正则性与技术假设，不能直接推广到任意曲面或非均匀耦合。

**证明逻辑/大纲**

1. **主张：** 协变热方程建立有限能量空间的几何频率分解与频率包络控制。
   - **路线：** 在 caloric 规范 $A\_s=0$ 下求解协变热方程，先由 Lemma 3\.1 推导协变 Hessian、磁场、荷密度和 Gauss 张力的抛物方程，再以 Proposition 3\.2 的抛物平滑和抛物 Strichartz 估计定义频率尺度。Propositions 3\.7、3\.19、3\.25 将 caloric extension、$E$ 拓扑、频率包络和光滑近似联系起来，使粗糙构型可以由光滑构型逼近。
2. **主张：** 光滑解的局部存在、延拓准则和全局高阶能量控制闭合。
   - **路线：** 在 DeTurck 规范下用仿射 Sobolev 空间中的 Picard 迭代构造局部光滑解；对协变导数应用抽象 Schrödinger 能量估计和磁性插值，得到高阶能量微分不等式。式 $\(4\.2\)$ 给出控制参数可积即能延拓的准则，Proposition 4\.3 在有限能量和 Gauss 张力控制的短时间片上给出其积分界，再结合能量守恒与张力输运反复延拓到全时间。
3. **主张：** 抛物拟微分化和短时间 Strichartz 估计把高频主方程变成可控的线性演化。
   - **路线：** 由动态协变热方程导出 covariant Hessian 的方程 $\(5\.1\)$ 及电磁场、张力场的伴随方程；在 caloric-temporal 规范中将其抽象为线性 paradifferential 方程。Proposition 8\.1 用低高抛物对易子 $\(8\.3\)$ 控制协变能量，并在长度 $\|J\|\\sim s^\{1/2\}$ 的半经典时间片上应用常系数 Schrödinger Strichartz 估计 $\(8\.5\)$；把单位时间区间划分成 $O\(s^\{-1/2\}\)$ 个子区间，得到带导数损失的全局时间估计 $\(8\.2\)$。
4. **主张：** 频率包络 bootstrap 闭合光滑解的全局协变估计。
   - **路线：** 以控制参数积分界 $\(9\.7\)$ 和协变能量界 $\(9\.8\)$ 为 bootstrap 假设；Proposition 9\.3 将协变 Hessian 方程右端压到控制参数乘频率包络的量级 $\(9\.9\)$，再调用 Proposition 8\.1 得到 Strichartz 界 $\(9\.3\)$。低频部分用 Sobolev 型估计，高频部分用协变 Strichartz 和抛物平滑控制 $\\\|\\varphi\\\|\_\{L\_t^2L\_x^\\infty\}$，选取足够小的 $T\_\*$ 改善 $\(9\.7\)$、$\(9\.8\)$，从而得到 Theorem 9\.1 和迭代后的 Corollary 9\.2。
5. **主张：** 从光滑解过渡到有限能量解并完成唯一性、连续性和规范转移。
   - **路线：** 对两条解建立弱 $E^0$ 距离的不等式 $\(10\.2\)$，通过对数型差分估计和 Lemma 10\.2 的非线性 Gronwall--Osgood 引理得到 Theorem 10\.1 的弱 Hölder 连续性；Theorem 10\.8 将该估计降到有限能量正则性，给出无条件唯一性。Section 11 先用 Corollary 3\.26 光滑逼近初值，再用 Theorems 4\.2、4\.4 和 9\.1 的一致界取极限，式 $\(11\.1\)$--$\(11\.3\)$ 给出能量拓扑收敛；最后 Proposition 11\.2 构造 $\\chi=-\(\\partial\_t-\\Delta\)^\{-1\}\(A\_t-\\partial\_jA\_j\)$，用 Lemma 11\.3 保证转回 DeTurck 规范的连续性，闭合 Theorem 1\.2。

**排序理由**

正文核查显示该文围绕“全局能量适定性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 96/100。

**AI 协作披露**

作者在正文末尾明确披露两项使用：ChatGPT 将作者手绘的 Figures 5\.1 和 7\.1 转换为论文图形；Gemini 3\.1 Pro 指出了 Lemma 10\.2 与 Osgood 唯一性判据之间的联系。披露范围仅包括图形转换和论证概念联系提示；作者未声明 AI 参与方程推导、主体证明计算、代码实现、正文写作、编辑校对、翻译、排版或其他图表制作。

来源：已核查 PDF 第 1--111 页全文，重点检查引言中的证明路线、Sections 2--11、Appendices A--C、Acknowledgements、Disclosure of AI usage、References 及正文末尾。Acknowledgements 位于 PDF 第 13 页，仅感谢 Sung-Jin Oh、研究机构接待和 NSF 资助；同页 Disclosure of AI usage 明确列出 ChatGPT 与 Gemini 3\.1 Pro 的上述用途。参考文献和作者信息位于 PDF 第 109--111 页，未见其他 AI、软件或工具声明。

**原始英文摘要**

The Chern-Simons-Schr\\"odinger equation \(in the temporal gauge\) arises as the Hamiltonian flow of the abelian Higgs energy on $\\mathbb R^2$\. Manton \(arXiv:hep-th/9701027\) introduced the equation as a model for the dynamics of the critical points of the energy, known as vortices\. He conjectured that, for a certain range of coupling constants, the vortex motion under the Chern-Simons-Schr\\"odinger flow can be effectively captured by a first-order ODE on the moduli space of self-dual vortices constructed by Jaffe-Taubes \(1980\) and Samols \(1992\)\. As a first step towards a rigorous proof of Manton's conjecture, we formulate the Cauchy problem in DeTurck gauge within the natural energy space and prove global well-posedness\. We also obtain, as a corollary of the well-posedness theory and the stability results in our previous work \(arXiv:2603\.24900\), orbital stability of the self-dual vortices under the Chern-Simons-Schr\\"odinger flow near self-dual coupling\. The heart of our analysis lies in developing a geometric Littlewood-Paley theory based on the covariant heat equation in caloric gauge, which we use to perform a paradifferential-style decomposition of the Chern-Simons-Schr\\"odinger equation\.

---

### 变分方法

#### On the Large $\\Lambda$ Asymptotics of the One Phase Bernoulli Free Boundary Problem

- **作者：** Giovanni Siclari
- **arXiv：** [2609\.12553](https://arxiv.org/abs/2609.12553) · [PDF](https://arxiv.org/pdf/2609.12553)
- **分类：** math\.AP
- **进展类型：** 自由边界大参数渐近展开
- **阅读优先级：** 95/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

研究一相 Bernoulli 自由边界泛函 $J\_\\Lambda\(v,D\)=\\int\_D\|\\nabla v\|^2\\,dx\+\\Lambda\|\\Omega\_v\|$ 在 $\\Lambda\\to\+\\infty$ 时的最小化结构。对 $g\\ge0$，作者给出最小值、正集、Dirichlet 能量及自由边界的渐近；对 $g&gt;0$，证明自由边界最终是边界 $\\partial D$ 上的解析图，并得到二阶展开。

**使用技术**

- 将 Fermi 坐标引入边界邻域，把问题约化为带 Jacobian 权重的一维 Bernoulli 问题。
- 用一维最小化、上下界竞争函数和能量超额控制得到剖面 $Q\(y,\\rho\)=\(g\(y\)-\\rho\)\_\+$ 的收敛。
- 使用谐延拓、最大值原理、Poisson 核估计和非退化性证明正集及自由边界到 $S\_g=\\\{g&gt;0\\\}$ 的 Hausdorff 收敛。
- 对移动中心作 $\\Lambda^\{1/2\}$ 缩放，通过紧性、滑动比较和分类结果识别半空间 blow-up，再结合平坦性改进和线性化得到高阶项。
- 利用切向参数化的 Jacobian、主曲率展开和 $\\nabla\_\\tau f\_\\Lambda$ 的渐近计算自由边界面积。

**可能的突破**

核心推进是把一维剖面能量的二阶展开与移动中心 blow-up 分类结合起来。作者得到 $\\Lambda\|\\Omega\_\{u\_\\Lambda\}\|$ 和 $\\int\_D\|\\nabla u\_\\Lambda\|^2\\,dx$ 的精确首项，并在 $g&gt;0$ 时证明自由边界为 $\\partial D$ 上的解析图，其高度满足 $f\_\\Lambda\(y\)=g\(y\)\\Lambda^\{-1/2\}\+\(d-1\)H\(y\)g\(y\)^2\(2\\Lambda\)^\{-1\}\+o\(\\Lambda^\{-1\}\)$，同时给出法向、切向梯度和面积的二阶修正。

**限制与不确定性**

$g\\ge0$ 时只能得到自由边界和正集到 $S\_g$ 的 Hausdorff 渐近；精细图形结构、法向和二阶展开要求更强的 $g&gt;0$，因此不覆盖接触集边界 $\\partial\\\{g&gt;0\\\}$ 附近的退化行为。作者明确指出一般非负边界数据在接触区域附近仍是开放问题。假设域为有界 $C^2$ 域且边界数据为 $C^1$，结论针对 $\\Lambda\\to\+\\infty$ 的渐近过程。

**证明逻辑/大纲**

1. **主张：** 通过一维 Bernoulli 约化得到最小值 $m\_\\Lambda$ 的二阶展开。
   - **路线：** 在 Fermi 坐标中定义带权一维泛函 $F\_\{\\Lambda,y\}$ 和最小值 $l\_\{\\Lambda,y\}$；用截断线性剖面作上界，用任意竞争函数的正集区间结构和显式积分作下界，得到 $l\_\{\\Lambda,y\}\(a\)=2a-\(d-1\)H\(y\)a^2\\Lambda^\{-1/2\}\+O\(\\Lambda^\{-1\}\)$，再对 $y$ 积分闭合 $m\_\\Lambda$ 的展开。
2. **主张：** 识别 Fermi 缩放后的极限剖面，并分离正集体积和 Dirichlet 能量的渐近。
   - **路线：** 令 $U\_\\Lambda\(y,\\rho\)=u\_\\Lambda\(\\Phi\(y,\\Lambda^\{-1/2\}\\rho\)\)$，将总能量与一维最小值之差转化为导数和示性函数的平方误差，利用 Lemma 3\.2 得到 $U\_\\Lambda$ 向 $Q\(y,\\rho\)=\(g\(y\)-\\rho\)\_\+$ 收敛；随后用伸缩变分恒等式和法向分解提取各项的首阶与曲率修正。
3. **主张：** 证明正集和自由边界到 $S\_g$ 的 Hausdorff 收敛，并在 $g&gt;0$ 时分类移动中心 blow-up。
   - **路线：** 对边界数据的谐延拓使用 Poisson 核上界控制远离 $S\_g$ 的正集；在 $g&gt;0$ 时把自由边界点按 $\\Lambda^\{1/2\}$ 缩放到半空间，先用局部 Hölder 紧性得到最小化器极限，再借助平面剖面比较、滑动法和强最大值原理证明唯一 blow-up $\(g\(y\_0\)-x\_d\)\_\+$，最后由非退化性和平坦性改进推出解析图形性。
4. **主张：** 通过线性化获得自由边界的二阶高度、法向和切向梯度，并计算面积展开。
   - **路线：** 先证明 $U\_\\Lambda\\to Q$ 一致收敛，再在移动中心坐标中展开边界为二次图，构造归一化误差 $v\_n=\(w\_n-P\_n\)/\\sigma\_n$；紧性引出带二次边界数据和顶端 Neumann 条件的经典椭圆问题，反射与 Liouville 定理唯一确定极限。由自由边界图的局部表示恢复 $f\_\\Lambda$、$\\nu\_\\Lambda$ 和 $\\nabla\_\\tau f\_\\Lambda$，最后将切向 Jacobian 写成曲率矩阵行列式与梯度因子并展开。

**排序理由**

正文核查显示该文围绕“自由边界大参数渐近展开”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 95/100。

**AI 协作披露**

作者明确声明 ChatGPT 5\.6 Sol 用于核查整篇论文的证明，并用于处理若干计算量较大的证明细节，具体包括 Lemma 3\.2、Proposition 3\.10、Proposition 5\.7、Theorem 5\.9、Lemma 6\.3、Lemma 6\.4、Theorem 6\.1 和 Theorem 6\.6。作者同时声明所有策略和论证由人类生成，论文不含 AI 撰写文本，并由作者承担责任；唯一例外是 Lemma 6\.7 背后的论证来自与 ChatGPT 5\.6 Sol 的对话，仅作最小修改。

来源：披露位于正文末尾 PDF p\. 46 的独立“AI statement”，紧接 Proposition 6\.8 证明之后、Acknowledgements 之前；同时核查了正文第 1--46 页及 References 延续页，未发现其他 AI/工具披露。

**原始英文摘要**

In this paper, we investigate the asymptotic behavior of minimizers $u\_\\Lambda$ of the Bernoulli functional $\\int\_D \|\\nabla v\|^2 \\, dx \+\\Lambda\|\\Omega\_v\|$ for large $\\Lambda$ with a boundary datum $g \\ge 0$\. In particular, in the case $g&gt;0$, we show graphicality of the free boundary over $\\partial D$ and obtain a second order asymptotic expansion in $\\Lambda$ of the graph\.

---

#### From $\\mathrm\{BV\}^\\mathcal A$ to $\\mathrm\{BV\}$: An endpoint Korn estimate

- **作者：** Marco Caroccia
- **arXiv：** [2609\.13103](https://arxiv.org/abs/2609.13103) · [PDF](https://arxiv.org/pdf/2609.13103)
- **分类：** math\.AP、math\.FA
- **进展类型：** $BV^\\mathcal A$ 到 $BV$ 的端点 Korn 估计
- **阅读优先级：** 95/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文证明：若一阶常系数算子 $\\mathcal A$ 为 $C$-椭圆，且 $u\\in BV^\\mathcal A\(\\Omega;V\)$ 的近似梯度满足 $\\nabla\_\{\\mathrm\{ap\}\}u\\in L^1\(\\Omega;V\\otimes\\mathbb R^d\)$，则 $u\\in BV\(\\Omega;V\)$，并有 $\|Du\|\(\\Omega\)\\leq C\_\{d,\\mathcal A\}\(\|\\mathcal Au\|\(\\Omega\)\+\\int\_\\Omega\|\\nabla\_\{\\mathrm\{ap\}\}u\|\\,dx\)$。证明通过局部化、卷积、零空间多项式投影和 $BV$ 紧性实现。

**使用技术**

- $C$-椭圆算子与 $BV^\\mathcal A$ 空间
- $BV^\\mathcal A$ 的 Poincare 不等式
- 近似梯度与卷积收敛
- Calderón--Zygmund 弱型 $\(1,1\)$ 估计
- 局部弱 Korn--Poincare 估计
- 零空间多项式的有限维范数等价
- 网格立方体覆盖与有限重叠
- 同尺度卷积分解
- $BV$ 紧性和下半连续性

**可能的突破**

定理 1\.1 给出一个无例外集的端点 Korn 型估计：对任意开集 $\\Omega$，只要 $\\mathcal A$ 是 $C$-椭圆且 $u\\in BV^\\mathcal A\(\\Omega\)$ 的完整近似梯度属于 $L^1$，则 $u$ 自动属于 $BV$。核心突破是将 Poincare 投影选出的零空间多项式 $a\_\{r,x\}$ 的梯度置于同一局部尺度上，通过弱 $L^1$ 控制与零空间有限维范数等价转化为强 $L^1$ 控制，最终闭合卷积梯度估计。

**限制与不确定性**

结论依赖一阶常系数算子具有 $C$-椭圆性；论文不处理变系数、非椭圆或更高阶算子。近似梯度的 $L^1$ 可积性仍是关键假设，不能仅由 $\\mathcal Au$ 的有限测度性推出。证明给出定量存在性估计，但不涉及最佳常数、边界上的全局精细结构或更弱积分条件下的替代结论。

**证明逻辑/大纲**

1. **主张：** 定理 1\.1 将问题归约为控制近似梯度和算子测度，并建立零空间投影的局部 Poincare 估计。
   - **路线：** 对 $C$-椭圆算子定义 $BV^\\mathcal A$，利用近似可微性得到 $\\nabla\_\{\\mathrm\{ap\}\}u$。在球 $B\_r\(x\)$ 上取 $L^2$ 投影 $a\_\{r,x\}=\\Pi\_\{B\_r\(x\)\}u\\in\\ker\(\\mathcal A\)$，由 $BV^\\mathcal A$ 的 Poincare 不等式控制 $\\int\_\{B\_r\(x\)\}\|u-a\_\{r,x\}\|\\,dx$，为后续同尺度卷积分解提供局部误差界。
2. **主张：** 命题 4\.1 证明相对于同一投影多项式的近似梯度具有局部弱 $L^1$ 控制。
   - **路线：** 用紧支撑截断函数作用于 $u-a\_\{r,x\}$，由截断乘积法则把算子测度控制在 $\|\\mathcal Au\|\(B\_r\(x\)\)$ 内；将截断函数延拓到全空间后应用全局弱端点估计，限制回半球即得 $\\\|\\nabla\_\{\\mathrm\{ap\}\}u-\\nabla a\_\{r,x\}\\\|\_\{L^\{1,\\infty\}\(B\_\{r/2\}\(x\)\)\}\\leq C\_\{d,\\mathcal A\}\|\\mathcal Au\|\(B\_r\(x\)\)$。
3. **主张：** 引理 4\.2 和引理 4\.3 将零空间梯度的弱 $L^1$ 控制提升为强 $L^1$ 控制。
   - **路线：** 由 $C$-椭圆性，$\\ker\(\\mathcal A\)$ 为有限维多项式空间，因此其梯度所在空间上的 $L^\{1,\\infty\}$ 准范数与 $L^1$ 范数等价。将 $\\nabla a\_\{r,x\}=\\nabla\_\{\\mathrm\{ap\}\}u-\(\\nabla\_\{\\mathrm\{ap\}\}u-\\nabla a\_\{r,x\}\)$ 分解，结合弱范数的准三角不等式和 $\\\|f\\\|\_\{L^\{1,\\infty\}\}\\leq\\\|f\\\|\_\{L^1\}$，得到 $\\int\_\{B\_\{r/2\}\(x\)\}\|\\nabla a\_\{r,x\}\|\\,dx$ 被 $\\int\|\\nabla\_\{\\mathrm\{ap\}\}u\|$ 与 $\|\\mathcal Au\|$ 控制。
4. **主张：** 第 5 节通过网格卷积估计、有限重叠求和及 $BV$ 紧性完成主定理证明。
   - **路线：** 在任意 $\\Omega'\\Subset\\Omega$ 内取尺度为 $\\varepsilon$ 的网格，对每个立方体使用对应球上的投影多项式，并将卷积梯度分解为振荡项与零空间项。公式（18）--（21）控制振荡项，公式（22）--（23）结合引理 4\.3 控制零空间项，合并得到每个网格块的估计（24）。利用球族有限重叠求和得到与 $\\varepsilon$ 无关的全局界（25），再由卷积收敛、$BV$ 紧性和下半连续性得到 $u\\in BV\(\\Omega'\)$ 及总变差估计；最后对 $\\Omega$ 作穷竭。

**排序理由**

正文核查显示该文围绕“$BV^\\mathcal A$ 到 $BV$ 的端点 Korn 估计”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 95/100。

**AI 协作披露**

作者明确披露生成式 AI 参与研究过程。初始的非局部球面平均策略经与生成式 AI 的持续互动发展为最终的完整工作形式；随后 AI 被作为交互式研究助手，用于讨论、测试和简化论证，识别零空间多项式梯度控制这一关键问题，并促成局部弱端点估计与有限维范数等价的证明路线。作者还明确说明 AI 用于测试中间论证、查找相关参考文献以及协助英文表述，并声明对论文内容承担全部责任。披露未说明 AI 用于代码、数据分析、校对、翻译、排版、图表或插图，也未具体指明服务提供商。

来源：PDF 第 3 页第 1\.1 节末尾提及与生成式 AI 的互动；PDF 第 4 页第 1\.2 节 AI content disclosure 全文及其末尾责任声明已核查。

**原始英文摘要**

In this short note we prove that, given a $\\mathbb\{C\}$-elliptic operator $\\mathcal\{A\}$ and a map $u\\in \\mathrm\{BV\}^\{\\mathcal\{A\}\}\(\\Omega;V\)$ satisfying \\\( \\nabla\_\{\\mathrm\{ap\}\}u\\in L^1\(\\Omega;V\\otimes\\mathbb\{R\}^d\), \\\) then $u\\in \\mathrm\{BV\}\(\\Omega;V\)$\. The result is quantitative and follows from the Korn-type estimate \\\[ \|Du\|\(\\Omega\) \\leq C\_\{d,\\mathcal\{A\}\}\\left\( \\\|\\nabla\_\{\\mathrm\{ap\}\}u\\\|\_\{\\mathrm\{L\}^1\(\\Omega\)\} \+ \|\\mathcal\{A\}u\|\(\\Omega\) \\right\), \\\] valid for every such $u\\in \\mathrm\{BV\}^\{\\mathcal\{A\}\}\(\\Omega;V\)$\. As a consequence, we obtain the characterization \\\[ \\mathrm\{BV\}^\{\\mathcal\{A\}\}\(\\Omega;V\)\\setminus \\mathrm\{BV\}\(\\Omega;V\) = \\left\\\{ u\\in \\mathrm\{BV\}^\{\\mathcal\{A\}\}\(\\Omega;V\): \\nabla\_\{\\mathrm\{ap\}\}u\\notin L^1\(\\Omega;V\\otimes\\mathbb\{R\}^d\) \\right\\\}\. \\\] Generative AI has been exploited\. The usage is detailed in a specific Section\.

---

#### Bernstein theorem for $3$-dimensional anisotropic minimal graphs with free boundary

- **作者：** Guofang Wang、Wei Wei、Chao Xia、Xuwen Zhang
- **arXiv：** [2609\.12630](https://arxiv.org/abs/2609.12630) · [PDF](https://arxiv.org/pdf/2609.12630)
- **分类：** math\.DG、math\.AP
- **进展类型：** 各向异性自由边界极小图的正则性与刚性
- **阅读优先级：** 92/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--36 页。论文先对各向异性极小曲面方程的自由边界混合问题进行严格椭圆正则化和 $\\tau$ 一致梯度估计，证明半球域混合边值问题的存在唯一性与可去奇点性；继而在三维半空间用 blow-down、各向异性极小集紧性、边界正则性和 Harnack 二分法证明任意满足自由边界条件的整个各向异性极小图必须为仿射函数，并推出恒定接触角的半仿射结论。

**使用技术**

- 一齐次均匀椭圆积分函数、Wulff 几何与各向异性通量
- 正则化 $f\_\\tau=f\+\\frac\{\\tau\}\{2\}f^2$、严格凸泛函直接法与唯一极小化子
- 变分积分方法、自由边界梯度估计与 Moser 型迭代
- BV 紧性、局部 Schauder 正则性、障碍函数与截断极限
- 各向异性极小集、周长增长、blow-down 紧性与边界 $\\varepsilon$-正则性
- 法向量的各向异性 Harnack 估计、奇点可去性与 Bernstein 反证法

**可能的突破**

第一主结果解决半球上球面 Dirichlet、平面自由边界的各向异性混合边值问题，并给出可去奇点工具；第二主结果在三维半空间证明全局各向异性自由边界极小图的 Bernstein 刚性。关键是将 $\\tau$-一致梯度估计传过非均匀椭圆极限，再把图的子图转为各向异性极小集，通过 blow-down 后的边界 Harnack 与 $\\varepsilon$-正则性把极限法向量恒定性反推回原图。

**限制与不确定性**

结果依赖 $F$ 光滑、一齐次、均匀椭圆且 Wulff 形严格凸，以及欧氏半球和半空间几何；Bernstein 刚性只在图维数 $n=3$ 成立，论文明确不覆盖 $n\\ge 4$（已有反例），也不处理一般非图形自由边界极小超曲面或非平面、粗糙边界。混合边值解要求球面数据可由邻域内 $C^2$ 函数延拓，极限正则性和唯一性主要在所构造的解类内；证明依赖 BV 紧性、边界 $\\varepsilon$-正则性和 Harnack 工具，但没有给出定量稳定性、非仿射近似误差或奇异流、重联理论。

**证明逻辑/大纲**

1. **主张：** 正则化并求解自由边界混合边值问题。
   - **路线：** 定义 $f\_\\tau\(y\)=f\(y\)\+\\frac\{\\tau\}\{2\}f\(y\)^2$，由 Lemma 3\.1 的椭圆性估计保证正则化方程统一椭圆；构造严格凸泛函 $A\_\\tau$，用直接法得到唯一极小化子，并由一阶变分得到弱方程、BV 能量界和局部正则性。
2. **主张：** 建立与参数 $\\tau$ 无关的边界和内部梯度估计。
   - **路线：** 利用正则化问题的变分结构处理自由边界项，建立积分不等式和边界 Sobolev 估计；Lemma 3\.5 至 Lemma 3\.8 的迭代将局部振荡控制闭合为梯度上界，Theorem 3\.3 给出边界和内部的指数型估计，随后线性障碍函数给出一致的 $L^\\infty$ 界。
3. **主张：** 令 $\\tau$ 趋于零并闭合 Theorem 1\.1 的存在性、正则性和弱积分恒等式。
   - **路线：** 由一致 $L^\\infty$ 界和 BV 界取紧子列得到 \(3\.30\)，局部梯度界使方程在紧子域上保持统一椭圆，从而得到 $C^2$ 局部收敛 \(3\.31\)；障碍函数给出球面边界迹 \(3\.32\)--\(3\.34\)，对球面附近测试函数截断并用支配收敛传递弱恒等式 \(1\.10\)，严格单调性 \(2\.6\) 给出唯一性。
4. **主张：** 去除自由边界上的紧奇点。
   - **路线：** 用 Theorem 1\.1 在包含奇点集的半球内构造替代解，围绕奇点集和棱边取满足 $\\int\|D\\eta\_\\varepsilon\|\\le C\\varepsilon$ 的截断函数；将原解与替代解的弱恒等式相减，利用严格单调性 \(2\.6\) 和 $\\varepsilon$ 趋于零得到梯度相等，再由球面迹确定加性常数为零。
5. **主张：** 在三维半空间证明 Bernstein 刚性。
   - **路线：** 由 Lemma 5\.1 将图的子图视为各向异性极小集；任取 blow-down 序列，利用极小集紧性得到极限，并由子图结构得到 $D\_4\\chi\_\{E\_\\infty\}\\le0$。边界正则性排除二维奇点后，Lemma 5\.4 对 $V\_F=F\_\\nu\(\\nu\)\_4$ 的均匀椭圆方程 \(5\.4\) 使用 Harnack 二分法和 $\\varepsilon$-正则性，得到法向收敛 \(5\.10\)；缩放回原图后任意点法向都等于极限法向，故图为超平面。

**排序理由**

正文核查显示该文围绕“各向异性自由边界极小图的正则性与刚性”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 92/100。

**AI 协作披露**

作者在 PDF 第 7 页的 On the use of AI 段落中明确披露 ChatGPT 5\.6 Pro 协助识别正则化设定 \(1\.11\)，并协助获得混合边值问题 Theorem 1\.1 的存在性与正则性所需估计。作者声明已核验全部论证，并对证明的完整性与正确性负责；因此 AI 协助范围不替代作者对最终数学论证和证明的核查与责任。未进一步说明是否用于代码、编辑、校对、翻译、排版、图表或插图。

来源：逐页核查 PDF 第 1--36 页，覆盖 Introduction、Sections 2--5、全部定理证明、Acknowledgments、On the use of AI（第 7 页）及 References；AI 声明和具体用途位于第 7 页。

**原始英文摘要**

In this paper, we continue our recent study on anisotropic minimal surface equation with free boundary condition in Wang-Wei-Xia-Zhang \(Arch Ration Mech Anal 250:42, 2026\)\. The first main result solves the corresponding mixed boundary value problem\. As an application, we prove the following Bernstein-type theorem: any anisotropic minimal graph over $\\mathbb\{R\}^3\_\+$ with free boundary must be flat\. These extend the classical results of Simon \(Indiana Univ Math J 25:821--855, 1976; Math Z 154:265--273, 1977\) to an appropriate free boundary setting\.

---

### 椭圆与抛物方程

#### Counterexamples to Wang's Conjecture

- **作者：** Ruiqi Jiang、Linlin Sun
- **arXiv：** [2609\.13079](https://arxiv.org/abs/2609.13079) · [PDF](https://arxiv.org/pdf/2609.13079)
- **分类：** math\.AP、math\.DG
- **进展类型：** Wang 猜想的欧氏反例构造
- **阅读优先级：** 92/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文否定了 Wang 关于非线性 Robin 问题正解恒定性的猜想。作者在每个 $n\\geq3$ 下先构造由 $n\+1$ 个单位球交集形成的 Lipschitz 严格凸域，在其上给出 Newtonian 非常数显式解并证明线性化非退化；随后将该域从内部光滑化，利用 Robin resolvent 的紧性和 Leray--Schauder 度延拓得到边界主曲率全大于 $1$ 的实解析严格凸欧氏域及非恒定正光滑解。

**使用技术**

- 单位球交集的几何构造
- Newtonian 势显式解
- Steklov 特征值估计
- 加权 Rellich--Pohozaev 型恒等式
- Kelvin 反演线性化
- log-sum-exp 内部光滑逼近
- 径向双 Lipschitz 拉回
- Robin resolvent 紧性
- 局部 Leray--Schauder 度理论

**可能的突破**

定理 1\.3 证明：对每个 $n\\geq3$，存在接近临界指数 $q\_\*=n/\(n-2\)$ 的 $q$ 和满足 $\\delta/\(q-1\)&lt;\\lambda\\leq1/\(q-1\)$ 的参数，使得某个有界实解析严格凸欧氏域 $\\Omega\_\*$ 满足 $\\min\_\{\\partial\\Omega\_\*\}\\kappa\_i&gt;1$，却存在非恒定正光滑解 $\\Delta u=0$、$\\partial\_\\nu u\+\\lambda u=u^q$。核心机制是单位球交集上的显式解、严格 Steklov 间隙 $\\sigma\_1&gt;1$ 导出的线性化核平凡性，以及度不变量在光滑域和指数扰动下的保持。

**限制与不确定性**

反例只覆盖 $n\\geq3$ 且 $q$ 接近临界指数、$\\lambda$ 位于指定窄区间的情形，不能否定所有参数范围下的 Wang 猜想。初始显式域是 Lipschitz 而非光滑，光滑化后的解依赖小参数和局部度延拓。论文不研究解的唯一性、所有正解的分类或更一般流形几何下的完整参数区域；二维情形也未由该构造处理。

**证明逻辑/大纲**

1. **主张：** 第 2 节构造球交域 $\\Omega$ 并给出非恒定显式 Robin 解。
   - **路线：** 选择位于半径 $2$ 球面上的 $n\+1$ 个仿射独立球心，令 $\\Omega$ 为对应单位球交集。引理 2\.1 证明交集有非空内部、每个球面贡献边界面且趋近于平移单位球。取 $u\_\*\(x\)=\(3a\)^a\|x\|^\{2-n\}$，在每个球面面片上利用 $\|x\|^2-2x\\cdot\\nu=3$ 验证 $\\partial\_\\nu u\_\*\+au\_\*=u\_\*^\{q\_\*\}$，从而得到弱解。
2. **主张：** 命题 2\.4 和推论 2\.5 证明显式解的线性化非退化。
   - **路线：** 定义边界距离构造函数 $V$，其分片二阶导数包含负定体积项和界面正半定测度。引理 2\.3 将 Steklov 边界能量与 $\|\\nabla v\|^2$、$V\|D^2v\|^2$ 及界面法向导数平方联系起来，推出首个正 Steklov 特征值满足 $\\sigma\_1\(\\Omega\)&gt;1$。再用保持单位球面的 Kelvin 反演把显式解处的线性化 Robin 问题转化为 $\\sigma=1$ 的 Steklov 问题，因此线性化核平凡。
3. **主张：** 第 3 节将 Lipschitz 域内逼近为严格凸实解析域，并保持 Robin resolvent 的紧性。
   - **路线：** 用 $G\_\\tau=\\tau\\log\(2\\sum\_j e^\{f\_j/\\tau\}\)$ 定义 $\\Omega\_\\tau=\\\{G\_\\tau&lt;0\\\}$，直接计算梯度和 Hessian，证明边界主曲率下界大于 $1$。沿共同内部点的射线定义径向拉回 $\\Phi\_\\tau:\\Omega\\to\\Omega\_\\tau$，由 Minkowski 泛函收敛得到 $D\\Phi\_\\tau\\to I$，从而拉回后的椭圆矩阵和边界 Jacobian 收敛。命题 3\.2 给出 Robin 问题的统一估计，进而引理 3\.3 证明 resolvent 算子紧性及 $\\tau\\to0$ 的一致收敛。
4. **主张：** 命题 3\.4 通过局部 Leray--Schauder 度延拓得到定理 1\.3 的非恒定解。
   - **路线：** 把拉回后的 Robin 问题写成边界空间上的紧算子不动点方程 $F\_\{\\tau,q\}\(z\)=z$。推论 2\.5 保证 $\(\\tau,q\)=\(0,q\_\*\)$ 处显式解是孤立非退化不动点，因此局部度为 $\\pm1$。利用引理 3\.3 的紧性排除边界上的同伦零点，保持度不变，得到所有充分小的 $\\tau$ 和接近 $q\_\*$ 的 $q$ 的正非恒定光滑解。最后对域和解作缩放，使 Robin 参数落入指定区间，并由命题 3\.1 与尖锐 Steklov 估计保持主曲率和特征值大于 $1$。

**排序理由**

正文核查显示该文围绕“Wang 猜想的欧氏反例构造”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 92/100。

**AI 协作披露**

作者明确披露使用 AI 辅助工具，主要是 ChatGPT 5\.6；作者核验并完成全部数学论证，并对内容承担全部责任。披露没有进一步说明工具用于研究、证明、写作、代码、编辑、校对、翻译、排版或图表中的具体哪一项，因此可确认 AI 辅助参与，但具体用途范围未细分。

来源：PDF 第 14 页文末的 Disclosure on AI assistance；同页 References 前的声明区域已核查。

**原始英文摘要**

In this paper, we give a negative answer to Wang's conjecture\. For every $n\\geq 3$, there exist $\\varepsilon&gt;0$ and $\\delta \\in \(0,1\)$ such that, for all $q$ and $\\lambda$ satisfying \\\[ \\frac\{n\}\{n-2\}-\\varepsilon&lt;q\\le \\frac\{n\}\{n-2\}, \\qquad \\frac\{1\}\{q-1\}\\cdot \\delta&lt;\\lambda\\le \\frac\{1\}\{q-1\}, \\\] there exists a bounded Euclidean domain \\\(\\Omega\\subset\\mathbb\{R\}^n\\\) with principal curvatures bigger than \\\(1\\\) for which the following nonlinear Robin problem admits a nonconstant positive solution: \\begin\{align\*\} \\begin\{cases\} \\Delta u=0, & \\text\{in\}\\ \\Omega,\\\\\[2mm\] \\dfrac\{\\partial u\}\{\\partial\\nu\}\+\\lambda u=u^q, & \\text\{on\}\\ \\partial\\Omega\. \\end\{cases\} \\end\{align\*\}

---

#### Fractional porous medium equation on manifolds with nonnegative Ricci curvature: existence of solutions and smoothing effects via potential methods

- **作者：** Dorothea-Enrica von Criegern、Gabriele Grillo、Dario Daniele Monticelli
- **arXiv：** [2609\.12954](https://arxiv.org/abs/2609.12954) · [PDF](https://arxiv.org/pdf/2609.12954)
- **分类：** math\.AP
- **进展类型：** 分数阶多孔介质方程流形上的存在性与平滑效应
- **阅读优先级：** 90/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

已核查论文 PDF 第 1--57 页。论文研究 $\\partial\_t u\+\(-\\Delta\)^s\(u^m\)=0$ 在完备非紧无边界黎曼流形上的弱对偶解；在 $\\mathrm\{Ric\}\\ge0$、$n&gt;2s$ 且 $s$-非抛物性条件下，为非负 Green 加权初值构造解，并证明 $L^1$ 数据及 Green 加权数据的局部平滑估计。在非塌缩和统一体积增长条件下得到全局平滑估计，同时证明相应短时、长时指数在适当意义下最优，并推广到一般滤波非线性。

**使用技术**

- 谱分数阶 Laplace--Beltrami 算子、正最小 Green 函数与 $s$-非抛物性
- 弱对偶势公式与 Green 加权初值空间 $L^1\_\{G^s\_M,o\}\(M\)$
- Crandall--Liggett 非线性半群、隐式 Euler 离散与单调逼近
- Green 势局部估计、球覆盖、Hölder/Young 不等式与二进尺度迭代
- Bishop--Gromov 体积比较、非塌缩与统一体积增长条件
- Barenblatt 缩放、乘积流形构造与一般滤波非线性推广

**可能的突破**

主要进展是仅依靠 $s$-非抛物性建立 Green 加权空间 $L^1\_\{G^s\_M,o\}\(M\)$ 中非负初值的弱对偶解存在性，该空间严格大于 $L^1\(M\)$。论文进一步用 Green 势和非线性半群方法得到 $L^1$ 数据及 Green 加权数据的定量局部平滑效应，并在 Assumptions A1、A2 下将其提升为全局估计；Barenblatt 缩放、乘积流形和无穷多个局部 bump 的构造分别给出指数最优性及 Green 加权数据不产生全局有界解的反例，且第 11 节覆盖满足结构条件的一般滤波非线性。

**限制与不确定性**

结论限定于 $m&gt;1$、$s\\in\(0,1\]$、$n&gt;2s$ 的完备非紧无边界黎曼流形，并要求 $\\mathrm\{Ric\}\\ge0$ 及 $s$-非抛物性；全局平滑还需非塌缩 Assumption A1 和统一体积增长 Assumption A2。初值取非负函数，弱对偶解的唯一性与连续依赖主要在单调逼近得到的解类中成立，未覆盖符号变号数据、一般弱解类、有界区域及边界、负 Ricci 曲率或更一般的流形几何。Green 加权空间中的数据在 $\\mathbb\{R\}^n$ 上未必产生全局有界解，论文的全局结论正依赖关于极点的一致控制；长期行为和一般滤波推广也只在列出的结构条件与体积假设下给出。

**证明逻辑/大纲**

1. **主张：** 建立分数阶 Green 函数、加权空间和弱对偶框架。
   - **路线：** 从谱分数阶 Laplace--Beltrami 算子及热半群表示定义正最小 Green 函数，利用 $s$-非抛物性、Ricci 非负和 Bishop--Gromov 体积比较得到上下界；再定义 Green 加权 $L^1$ 空间与弱对偶积分恒等式，为后续势估计提供可积性接口。
2. **主张：** 由非线性半群构造并识别任意 Green 加权初值的弱对偶解。
   - **路线：** 先对 $L^1\(M\)\\cap L^\\infty\(M\)$ 数据使用分数阶热半群的次从属过程、m-accretivity 和 Crandall--Liggett 隐式 Euler 格式 \(8\.4\)，得到时间单调性、$L^p$ 非扩张性、序保持和 $L^1$ 收缩；借助势恒等式 \(8\.5\)--\(8\.9\) 将离散解的势公式传到极限，再以截断初值 $u\_\{0,k\}=\\min\\\{u\_0,k\\\}\\mathbf\{1\}\_\{B\_k\(o\)\}$ 和 Proposition 9\.2 的加权稳定性完成 Theorem 3\.1。
3. **主张：** 从 Green 势控制推出 $L^1$ 数据的局部平滑估计。
   - **路线：** Proposition 9\.1 先由弱对偶恒等式、局部化测试函数和时间单调性得到 Green 势收缩与点值控制 \(9\.1\)--\(9\.2\)；在 Theorem 3\.3 的证明中用局部 Green 核的近对角和远场界 \(10\.2\) 分裂势积分，应用 Young 不等式得到相邻球之间的递推 \(10\.3\)，再以二进尺度球覆盖迭代闭合主估计 \(10\.4\)、\(10\.7\)，按尺度选择得到短时、长时和精细长时估计。
4. **主张：** 在统一几何条件下获得全局平滑，并处理 Green 加权数据。
   - **路线：** 利用第 7 节关于 Green 函数和测试函数势的极点一致估计，将 Assumption A1 的非塌缩和 Assumption A2 的统一体积增长编码为 $h\(R\)$、$F\(R\)$、$\\theta\(R\)$；把局部常数替换为统一常数，得到 Corollary 3\.5 的全局估计 \(3\.1\)--\(3\.5\)，并用同一分裂迭代及 \(10\.8\) 证明 Theorem 3\.10 和 Corollary 3\.11。对 $s\\in\(0,1/2\)$，Proposition 4\.1 说明非抛物性及部分几何条件自动成立。
5. **主张：** 验证平滑指数的最优性并扩展到一般滤波非线性。
   - **路线：** 在 $\\mathbb\{R\}^n$ 上用 Barenblatt 解及方程缩放构造具有受控初值范数的解，得到短时指数 \(3\.6\)--\(3\.8\)；用 Green 加权局部 bump 函数、乘积流形和无穷多个互不相交 bump 函数分别验证长时、精细长时以及局部性质的尖锐性。第 11 节把幂函数替换为满足结构条件的 $\\Phi$，以 $H\_\\Phi$ 及其广义逆重写势点值估计和迭代，得到 \(11\.1\)--\(11\.5\)。

**排序理由**

正文核查显示该文围绕“分数阶多孔介质方程流形上的存在性与平滑效应”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 90/100。

**AI 协作披露**

作者在 Acknowledgments 中明确说明在本项目探索阶段使用了 AI 工具，但未说明具体工具或探索任务。作者同时声明最终稿中的全部数学论证和证明均由作者核查并撰写，因此明确排除了 AI 代替最终数学论证和证明；对于代码、编辑、校对、翻译、排版、图表或插图未作具体说明。该声明位于 PDF 第 55 页。

来源：论文 PDF 全文逐页核查（第 1--57 页），覆盖摘要、Introduction、Sections 2--11、Appendix A、正文末尾和 References；重点核查 Acknowledgments，AI 工具使用及“最终数学论证和证明由作者核查并撰写”的范围均见 PDF 第 55 页，并检索 AI、LLM、ChatGPT、Claude、Gemini、Copilot、Grammarly 等相关词。

**原始英文摘要**

We study the fractional porous medium equation on complete noncompact Riemannian manifolds with nonnegative Ricci curvature for $s\\in\(0,1\]$ and $n&gt;2s$\. Assuming that the manifold is $s$-nonparabolic, so that the fractional Laplacian admits a suitable positive minimal Green function, we use this Green function to introduce a natural weighted space of initial data, strictly larger than $L^1$\. This leads to a weak dual, or potential, formulation of the equation, for which we prove existence for nonnegative initial data in the weighted space\. We then establish quantitative local smoothing estimates for initial data in either $L^1$ or the Green-weighted space\. Under additional noncollapsing and uniform volume-growth assumptions, we obtain global smoothing estimates\. We also show that, even in $\\mathbb\{R\}^n$, data in the Green-weighted space need not generate bounded solutions unless a suitable uniform weighted integrability condition is imposed\. The short- and long-time behaviors predicted by our estimates are shown to be optimal in appropriate senses\. When $s\\in\(0,1/2\)$, the results require only $\\operatorname\{Ric\}\\geq0$, together with a noncollapsing assumption where needed\. Our estimates also cover the case $s=1$, several of them being new in that setting\. Finally, we extend the approach to more general filtration equations\.

---

#### Tangent-cone cancellation and Maz'ya's $\\Phi$-inequalities on finitely cornered planar domains

- **作者：** Zhouyu Long、Wenming Zou
- **arXiv：** [2609\.12755](https://arxiv.org/abs/2609.12755) · [PDF](https://arxiv.org/pdf/2609.12755)
- **分类：** math\.AP、math\.CA
- **进展类型：** 角点区域卷积势充要判据
- **阅读优先级：** 87/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究有限角点平面区域上的齐次卷积势与 Maz'ya 型非线性不等式，证明尖点切锥上的角向抵消条件同时刻画密度估计成立性，并进一步给出无限扇形、共形扇形图册延拓及牛顿核二次情形的分类结果。

**使用技术**

- 按尺度的二进制环带分解
- 切锥模型与移动中心 blow-up
- 卷积增量的非线性线性化
- 零阶矩与高阶矩估计
- 边界局部分类
- 共形扇形坐标与有限 Radon 测度延拓

**可能的突破**

在有界有限角点、分片 $C^\{1,\\beta\}$ 的平面区域上，建立了密度不等式 $\\int\_\\Omega \\Phi\(K\*f\)\\,dx\\leq C\\\|f\\\|\_1^p$ 的充要条件：平面、切半平面以及完整顶点切锥上的带符号角向抵消均成立，其中 $0&lt;\\alpha&lt;2$、$p=2/\(2-\\alpha\)$。论文还证明无限扇形需要额外的零均值条件，并给出精确共形扇形图册上的线性延拓及牛顿核二次型的维数分类。

**限制与不确定性**

密度定理限于有界有限角点且边界分片 $C^\{1,\\beta\}$ 的平面区域；无限扇形结果要求紧支撑密度具有零均值。延拓和偏微分方程判据依赖精确的共形扇形图册，未覆盖一般光滑或曲边角点。论文没有给出完整 Hessian 或 $W^\{2,1\}$ 估计，也未建立对扇形宽度的统一常数控制，且未处理高维多面体分层。

**证明逻辑/大纲**

1. **主张：** 定理 2\.7 给出有界有限角点区域上密度不等式的充要切锥抵消条件。
   - **路线：** 充分性先把核和密度按尺度分解到二进制环带，再用引理 4\.1 控制卷积增量；定理 7\.2 将局部矩信息转化为环带衰减；引理 8\.1 分类内部、光滑边界、边界角点三种模型；命题 8\.2 汇总各类环带估计并求和。必要性通过定理 3\.1 的集中族在切锥上放大，若任一模型抵消失败则构造发散序列。
2. **主张：** 大参数与移动中心构造完成必要性方向的 blow-up 论证。
   - **路线：** 选取集中于逐渐缩小环带的测试密度，将卷积势在切锥尺度下重标度；角向抵消失败产生不可消去的主项，而其余项由核的齐次性和角向 Lipschitz 控制保持低阶，从而使 $L^p$ 积分相对 $\\\|f\\\|\_1^p$ 无界。
3. **主张：** 定理 2\.9 将模型条件推广到无限扇形，并说明零均值是必要的远场抵消。
   - **路线：** 在扇形上重复环带分解，靠边界角点处的切锥抵消处理近场；对远场使用密度零阶矩为零，将核展开的一阶主项消除，再以矩估计控制余项并对环带求和。
4. **主张：** 定理 2\.10 和定理 2\.11 建立共形扇形图册上的延拓与牛顿核偏微分方程判据。
   - **路线：** 在扇形坐标中构造保持常数的线性延拓 $E\_\{\\Omega,A\}$，逐片拼接并控制边界跳跃，证明 $\\Delta Eu$ 是有限带符号 Radon 测度且满足估计（2\.13）；对牛顿核再把分布拉普拉斯算子与边界法向项配对，得到判据（2\.14）。

**排序理由**

正文核查显示该文围绕“角点区域卷积势充要判据”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 87/100。

**AI 协作披露**

作者明确声明使用 DeepSeek 协助绘图、语法检查、查找相关参考文献以及改进 exposition；同时明确排除其参与数学陈述、证明和结论的开发与核验，后者均由作者完成。

来源：PDF 第 52 页 Acknowledgements；PDF 第 51--52 页 Data Availability 与 Declarations。核查了正文末尾、致谢、数据可用性和声明部分，未见其他 AI 工具披露。

**原始英文摘要**

Let $0&lt;\\alpha&lt;2$, $p=2/\(2-\\alpha\)$, and let $K:\\mathbb\{R\}^2\\setminus\\\{0\\\}\\to\\mathbb\{R\}^m$ and $\\Phi:\\mathbb\{R\}^m\\to\\mathbb\{R\}$ be positively homogeneous of degrees $\\alpha-2$ and $p$, with Lipschitz angular parts\. For bounded finitely cornered piecewise-$C^\{1,\\beta\}$ planar domains $\\Omega$, we characterize the critical estimate $\|\\int\_\\Omega \\Phi\(K\*f\)\\,dx\|\\leq C\_\{\\Omega,K,\\Phi\}\\\|f\\\|\_\{L^1\(\\mathbb\{R\}^2\)\}^p$\. It holds if and only if signed angular cancellation holds on the plane, the tangent half-planes, and the complete vertex cones\. We obtain the analogous criterion on infinite sectors for compactly supported mean-zero densities\. For domains with a finite exact ambient conformal-sector atlas, we construct a constant-preserving linear extension $E\_\\Omega$ whose Laplacian is a finite signed Radon measure controlled by $\\\|\\Delta u\\\|\_\{L^1\(\\Omega\)\}\+\\\|\\partial\_n u\\\|\_\{L^1\(\\partial\\Omega\)\}$\. For the Newton kernel this yields a necessary-and-sufficient tangent-model criterion for the corresponding Maz'ya $\\Phi$-inequality\. We also classify the quadratic cancellation locus in polygon moduli\. At a genuine corner, the full vertex cone therefore carries an additional cancellation obstruction not detected by its incident tangent half-planes\.

---

### 其他分析方向

#### No free lunch for continuity of stochastic convolutions

- **作者：** Mark Veraar、Joris van Winden
- **arXiv：** [2609\.12688](https://arxiv.org/abs/2609.12688) · [PDF](https://arxiv.org/pdf/2609.12688)
- **分类：** math\.PR、math\.AP、math\.FA
- **进展类型：** 随机卷积路径连续性的反例与必要平方函数估计
- **阅读优先级：** 91/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文否定了任意强连续半群下随机卷积在端点条件 $g\\in L^\\infty\(\\Omega;L^2\(I;X\)\)$ 中必然具有有界连续路径的猜想。作者证明指数稳定半群的 $L^2$ 最大估计会强制负生成元满足下方平方函数估计，然后利用条件 Schauder 基构造两个反例：首先构造紧且指数稳定的解析半群，再通过带大虚部平移的有限维块构造具有有界 $H^\\infty$ 演算却仍无最大估计的 $C\_0$ 半群。外推论证把最大估计失败转化为正概率路径无界；最后给出对更强确定性能量包络的正面连续性结果。

**使用技术**

- 随机卷积与 $L^p$ 最大估计
- Poisson 半群次ordination
- 停时 Brownian 运动的 Green 公式
- Itô 公式与可选停止
- 平方函数估计与对偶性
- 条件三角 Schauder 基
- Schauder 乘子和 Schur 判别法
- 有限维块与纯虚平移
- 有界 $H^\\infty$ 演算
- Baire 范畴、乘积概率空间和 good-$\\lambda$ 外推
- 能量适配的二进制链式分割

**可能的突破**

定理 2\.2 建立了新的必要条件：若指数稳定半群 $S$ 满足 $M\_\{2,\\mathbb R\_\+\}\(S\)&lt;\\infty$，则负生成元 $A$ 必须满足 $\\\|x\\\|\\leq 2M\_\{2,\\mathbb R\_\+\}\(S\)\\\|x\\\|\_\{\\varphi,A\}$。关键恒等式（2\.10）把停时随机卷积与 Poisson 半群导数配对，经过对偶性推出下方平方函数估计。结合条件三角基，作者分别得到解析半群反例和具有有界 $H^\\infty$ 演算的非解析半群反例，说明即使平方函数双边估计成立，也不能去掉解析性。

**限制与不确定性**

反例建立在可分 Hilbert 空间、实一维 Brownian 噪声和可预测随机被积函数上，构造依赖特定条件三角 Schauder 基及块对角算子。无界性结论允许随机基底随构造变化，虽有备注说明可转移到固定随机基底，但相关转移依赖额外近似论证。正面定理只覆盖具有确定性能量包络的更小被积函数类，不能恢复一般 $L^\\infty\(\\Omega;L^2\)$ 条件下的最大估计；论文也不讨论更一般 Banach 空间中全部端点情形。

**证明逻辑/大纲**

1. **主张：** 第 2 节先证明平方函数双边估计蕴含最大估计，并建立最大估计蕴含下方平方函数估计的核心必要条件。
   - **路线：** 对解析半群将随机卷积嵌入扩展空间 $L^2\(\\mathbb R\_\+;X\)$ 中的 Brownian 鞅，利用平方函数上、下界和 Burkholder--Davis--Gundy 不等式得到命题 2\.1。随后令 $C=\(2A\)^\{1/2\}$，引入次ordination Poisson 半群 $P\_r=e^\{-rC\}$ 和击中零点的停时 Brownian 运动，借助后续恒等式对任意测试向量建立平方函数控制，再通过对偶性得到定理 2\.2。
2. **主张：** 引理 2\.3、引理 2\.4、引理 2\.6 和引理 2\.7 通过停时计算导出随机卷积与 Poisson 半群的关键恒等式。
   - **路线：** 先对被杀 Brownian 运动应用 Itô 公式得到占用时间公式（2\.6），再将其用于 $CP\_\{\\widehat\\beta\_t^a\}x$ 的平方积分。对 $P\_\{\\widehat\\beta\_t^a\}^\*y$ 应用 Itô 公式得到漂移项和 Brownian 项；把它与随机卷积方程配对时，$A$ 与 $A^\*$ 的漂移精确抵消，经过可选停止得到（2\.10）。对（2\.10）取模平方、用 Jensen 不等式和最大估计，再对随机过程作 $L^2$ 对偶，闭合定理 2\.2。
3. **主张：** 第 3 节用加权三角 Fourier 系统和 Schauder 乘子制造下方平方函数估计失败的解析半群。
   - **路线：** 在 $X=L^2\(\\mathbb T,w\)$、$w\(\\theta\)=\|\\theta\|^\{-\\alpha\}$ 上使用条件三角基，令乘子 $C f\_k=\\mu^k f\_k$ 且 $A=C^2$。通过矩阵系数 $B\_\{jk\}$ 的指数衰减和 Schur 判别法得到上方平方函数估计。选择截断 Dirichlet 核 $x\_n$，在长度约为 $n^\{-1\}$ 的区间上估计其加权范数为至少 $n^\{1\+\\alpha\}$，而系数的 $\\ell^2$ 范数仅为量级 $n$，故下方平方函数估计失败；定理 2\.2 随即给出最大估计失败。
4. **主张：** 第 4 节通过有限维块、纯虚平移和正交和构造具有有界 $H^\\infty$ 演算但最大估计失败的 $C\_0$ 半群。
   - **路线：** 将第 3 节乘子限制到有限维空间 $X\_n$，定义 $B\_n=n\(A\_n\+K\\\|A\_n\\\|iI\)$。纯虚平移保持最大常数不变；选取第 3 节的 $x\_n$ 使 $\\\|x\_n\\\|/\\\|x\_n\\\|\_\{\\varphi,B\_n\}$ 增长为 $n^\{\\alpha/2\}$，由定理 2\.2 得到 $M\_\{2,\\mathbb R\_\+\}\(S\_n\)\\gtrsim n^\{\\alpha/2\}$。另一方面，把归一化算子视为 $iI$ 的扰动并用有界 $H^\\infty$ 演算定理得到统一双边平方函数估计；最后取所有块的 $\\ell^2$ 正交和，得到紧、指数稳定、角度为 $\\pi/2$ 的半群且最大常数无穷。
5. **主张：** 第 5 节以定性到定量的外推把最大估计失败转化为路径无界，第 6 节则对更强确定性能量条件给出正面估计。
   - **路线：** 命题 5\.1 用 Baire 范畴证明路径有界、统一尾界和所有随机基底上的最大估计等价；乘积概率空间处理把不同基底的坏事件合并，good-$\\lambda$ 与三停时论证再推出有限最大常数。结合第 2--4 节的反例及区间独立性命题 5\.3，得到定理 1\.2 和定理 1\.3。第 6 节按 $g$ 的确定性能量定义时间变换和嵌套二进制分割，每层至多一个区间，通过 BDG 估计和可求和的尺度因子得到（6\.1），再由截断逼近恢复一般被积函数的连续版本。

**排序理由**

正文核查显示该文围绕“随机卷积路径连续性的反例与必要平方函数估计”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 91/100。

**AI 协作披露**

作者明确披露 GPT 5\.6 和 6 Pro 在论文准备期间被使用，用途包括探索证明策略、组织中间 LaTeX 草稿以及协助检查正确性。作者声明对论文内容承担全部责任。披露明确覆盖研究策略、证明正确性核查和写作排版草稿组织；未提及 AI 用于代码、数据分析、翻译、校对、图表或插图。

来源：正文末尾 PDF 第 17 页的 AI disclosure statement；该声明之后至 References 结束的 PDF 第 17--19 页已核查。

**原始英文摘要**

We construct compact, exponentially stable $C\_0$-semigroups $S$ on Hilbert spaces $X$ such that, for every $T&gt;0$, the stochastic convolution $U\_g\(t\)=\\int\_0^t S\(t-s\)g\(s\)\\,\\mathrm\{d\}\\beta\_s $ is unbounded on $\[0,T\]$ with positive probability for some predictable $g\\in L^\\infty\(\\Omega;L^2\(0,T;X\)\)$, where $\\beta$ is a real Brownian motion\. One example is even an analytic semigroup\. For the other, the negative generator $A$ has sectorial angle $\\pi/2$ and a bounded $H^\\infty$-calculus\. Our main tool is a necessary condition: for exponentially stable semigroups, an $L^2$-maximal estimate on $\\mathbb R\_\+$ forces a lower square-function estimate for the negative generator\. We deduce this implication from a new identity involving the stochastic convolution, the subordinated Poisson semigroup, and a stopped Brownian motion\. Combining this condition with Schauder multipliers on a conditional trigonometric basis yields counterexamples to the maximal estimate\. An extrapolation argument then produces the integrands with unbounded stochastic convolutions\. Finally, an energy-adapted chaining argument gives continuity and maximal estimates for arbitrary $C\_0$-semigroups under the stronger condition $g\\in L^2\(\[0,T\]; L^\\infty\(\\Omega;X\)\)$\.

---

#### Random field approximation and local counting statistics for the weakly interacting thermal Bose gas

- **作者：** Andreas Deuchert、Marcin Napiórkowski、Błażej Ruba
- **arXiv：** [2609\.12804](https://arxiv.org/abs/2609.12804) · [PDF](https://arxiv.org/pdf/2609.12804)
- **分类：** math-ph、math\.AP、math\.PR、quant-ph
- **进展类型：** 随机场极限与局部统计
- **阅读优先级：** 83/100 · 高优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文研究三维单位环面上弱相互作用玻色气体在临界温度尺度附近的巨正则 Gibbs 态。当期望粒子数 $N\\to\\infty$ 且 $\\beta/\\beta\_c\\to\\kappa$ 时，作者在凝聚相构造由凝聚模与热云组成的随机场近似，证明其热云收敛到新的 Bogoliubov 随机场，并将 Gibbs 态对应的点过程近似为 Cox 过程。由此得到凝聚相中量子场、非凝聚粒子数、动量模占据数及宏观区域粒子数的极限分布，并证明微观尺度 $N^\{-1/3\}$ 上的粒子统计收敛到与相互作用无关的玻色点过程；非凝聚相则通过理想气体的 Fredholm 行列式分析得到宏观和微观统计。

**使用技术**

- 将 Fock 空间按动量对分解为二模张量积，显式对角化温度依赖的二次 Bogoliubov Hamiltonian，并用 Weyl--Wigner、上符号和下符号把二模 Gibbs 算子表示为复高斯随机向量。
- 从带动量截断的高斯模构造随机 Fourier 场 $\\Phi\_N$，用共同高斯种子逐模耦合到 Bogoliubov 场 $\\Psi$；通过协方差差异、Sobolev 加权求和和指数矩估计证明场收敛。
- 利用 coherent-state quantization 的迹范数近似，将场近似传递到量子观测量；对动量占据数和粒子数使用 Gaussian 总变差估计、Wasserstein 耦合、混合 Poisson 表示及 Wick 平方。
- 对点过程的线性统计和区域计数使用特征函数、Cox 过程条件混合 Poisson 结构及局部核耦合；在微观尺度上通过协方差核的 Hilbert--Schmidt 和迹范数收敛识别玻色点过程。
- 在非凝聚相将相互作用 Gibbs 态约化为理想气体，利用 Jacobi theta 函数、Poisson 求和、Schatten 范数估计和正则化 Fredholm 行列式展开，分别处理宏观中心极限定理、微观有效质量场及临界尺度的 Wick 型极限。

**可能的突破**

核心贡献是给出弱相互作用正温玻色气体的随机场和点过程统一描述：凝聚相 Gibbs 态在迹范数意义下由凝聚模随机变量与 $N$ 依赖高斯热云场的 coherent-state quantization 近似，热云场收敛到新的 Bogoliubov 场。由此，宏观粒子数波动呈现凝聚涨落与热云场的叠加，而微观尺度 $N^\{-1/3\}$ 上的统计收敛到与相互作用势无关的玻色点过程，严格证明了相互作用体系中的微观普适性和玻色 bunching。

**限制与不确定性**

主要结果依赖三维单位环面、非负偶周期相互作用势、加权 Fourier 可求和条件及平均场缩放 $N^\{-1\}$。Theorems 1--3 的完整凝聚相表述针对 $\\kappa&gt;1$，非凝聚相 Theorem 5 针对 $\\kappa&lt;1$；临界点 $\\kappa=1$ 只在部分尺度和命题中讨论，未给出所有临界与介观尺度的统一定理。Bogoliubov 场仅几乎处处属于 $H^s$（$s&lt;-1/2$），高阶相关函数的控制依赖既有结果且作者明确未覆盖更高阶情形。微观统计分析主要约化到理想气体或有效二次理论，未涉及动力学、非环面几何或更强相互作用缩放。

**证明逻辑/大纲**

1. **主张：** 构造带截断的 Bogoliubov 参考 Gibbs 态及其高斯随机场上符号。
   - **路线：** 先按动量对分解非零模 Fock 空间，将二模 Bogoliubov Hamiltonian 对角化并计算其 Weyl 特征函数。Lemma 13 将 Weyl、下符号和上符号分别识别为复高斯分布；Lemma 14 验证在截断参数 $p\_c=O\(N^\{1/3\}\)$ 下上符号存在，随后式 $\(145\)$--$\(146\)$ 定义随机 Fourier 场 $\\Phi\_N$。通过单模协方差公式和正则性估计保证 $\\Phi\_N$ 几乎处处为光滑函数。
2. **主张：** 证明凝聚相 Gibbs 态的迹范数近似、$\\Phi\_N$ 到 Bogoliubov 场的收敛以及 Cox 点过程近似。
   - **路线：** 将全 Gibbs 态与截断 Bogoliubov 态比较，利用已有 Gibbs 态估计和半经典符号误差得到 Theorem 1\(a\) 的迹范数界 $\(19\)$。再用同一组独立高斯变量构造 $\\Phi\_N$ 和 $\\Psi$ 的共同耦合，逐模比较式 $\(158\)$--$\(163\)$ 的系数，并用 Sobolev 权重求和得到 $\(21\)$ 及 Corollary 18 的定量收敛。最后对 coherent-state 点过程计算特征函数 $\(165\)$，识别随机强度测度，结合迹范数误差完成 Theorem 1\(c\)。
3. **主张：** 从高斯场和混合 Poisson 表示推出凝聚相的量子场、动量占据数及宏观和微观计数统计。
   - **路线：** Section 5 先用 Gaussian 协方差比较、Pinsker 不等式和 Proposition 21 得到总变差与 Wasserstein 收敛，再以 Lemma 24 的混合 Poisson 表示和最大耦合把参考占据数传回真实 Gibbs 态，得到 Theorem 2 的 $\(27\)$--$\(31\)$。Section 6\.1 对宏观区域使用协方差核估计和 Gaussian 耦合得到 $\(33\)$--$\(36\)$，对微观区域将缩放核收敛到局部 Bogoliubov 场并由 Cox 过程特征函数得到 $\(37\)$。
4. **主张：** 在非凝聚和临界高温尺度上通过理想气体 Fredholm 行列式识别局部统计极限。
   - **路线：** 利用状态近似式 $\(62\)$ 将 Theorem 5 约化为理想气体。对宏观区域先由 Jacobi theta 函数和 Poisson 求和求粒子数方差，再把特征函数写成行列式 $\(276\)$，用 $\\\|A\\\|\_3=o\(1\)$ 和正则化行列式展开 $\(280\)$--$\(282\)$ 得到 Gaussian 极限。对微观尺度 $\\delta=N^\{-1/3\}$，将环面核经单位ary 缩放后用 Appendix B 的核渐近 $\(287\)$--$\(288\)$ 证明迹范数收敛，行列式极限 $\(289\)$ 识别为有效质量 Gaussian 场驱动的 Cox 过程；更大相关长度的临界情形由 Proposition 30 的 $\(290\)$--$\(296\)$ 处理。

**排序理由**

正文核查显示该文围绕“随机场极限与局部统计”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 83/100。

**AI 协作披露**

作者明确披露使用语言模型 GPT-5\.6 Sol 和 Gemini 3\.1 Pro 来改进论文表达、帮助学习数学概念、辅助计算以及校对；同时明确声明所有主要思想、数学表述、定理陈述和证明均由作者独立构思和发展。

来源：已核查 PDF 第 1--54 页全文，包括摘要、引言、Section 2--6、Appendices A--C、Acknowledgments、AI Disclosure、Data availability statement、References 及正文末尾。Acknowledgments 和 AI Disclosure 位于 PDF 第 44 页：前者列出 NSF 与 NCN 资助，后者列出 GPT-5\.6 Sol 和 Gemini 3\.1 Pro 的表达、概念学习、计算辅助和校对用途，并排除其对主要思想、数学表述、定理和证明的作者归属。Data availability sta……

**原始英文摘要**

We study weakly interacting bosons on the three-dimensional torus at temperatures proportional to the critical temperature for Bose--Einstein condensation\. We show that, as the expected particle number tends to infinity, the grand canonical Gibbs state is asymptotically described by the coherent state quantization of a random field that converges to a novel Bogoliubov random field\. Moreover, the point process associated with the Gibbs state can be approximated by a Cox process\. These results are based on and extend the approximation of the Gibbs state recently obtained by the first two authors and Nam\. Using these approximations, we compute limiting distributions of the number of particles outside the condensate, the joint occupation statistics of finitely many momentum modes, and particle-number fluctuations in macroscopic subsets of the torus, all governed by the Bogoliubov field\. We further prove convergence of the empirical measure of the associated point process to the uniform measure and convergence of the microscopic particle-number statistics to the boson point process\. The latter result establishes the universality of particle-number statistics on microscopic length scales\.

---

#### Parity-Skeleton First-Passage Dynamics and Optimal Intervention in Two-Sided Discrete Monitoring Systems

- **作者：** Ye Liang
- **arXiv：** [2609\.13000](https://arxiv.org/abs/2609.13000) · [PDF](https://arxiv.org/pdf/2609.13000)
- **分类：** math\.AP
- **进展类型：** 奇偶骨架首达动力学与干预优化
- **阅读优先级：** 52/100 · 中优先级
- **分析深度：** 已补读正文关键部分

**完成的工作**

论文建立双侧离散监测系统的有限状态首达框架。模型以带偏置的随机游走和对称吸收边界为核心，通过偶数与奇数奇偶骨架消除原始首达时间的奇偶间隙，证明奇偶修正寿命具有递增失效率，并用有限次幂矩阵计算生存概率、风险、RUL 和预防性干预策略。

**使用技术**

- 奇偶修正的出生死亡链
- 相邻行似然比与 Kijima 单调性判据
- 吸收链次随机矩阵
- 矩阵幂与 resolvent 计算
- 生存比率的几何包络
- 更新成本率与单调穿越搜索
- 漂移方差矩匹配校准
- 滚动窗口和 Monte Carlo 稳健性检验

**可能的突破**

命题 2\.4 证明所有正整数边界宽度对应的奇偶修正首达寿命 $T\_k$ 都具有递增失效率。其证明把偶数和奇数骨架的转移概率写成有限出生死亡链，并验证相邻行似然比严格大于 $1$；由此推得生存序列对数凹性和 NBU 性质。论文进一步把结构时间与原始遥测时间分离，给出精确次随机矩阵公式、几何持久概率上界以及基于更新成本的最优预防性干预年龄。

**限制与不确定性**

数值实验全部基于合成随机过程或合成监测轨迹，不能证明真实患者上的临床安全性、诊断准确性或治疗收益。基准模型假设校准后的增量局部独立，正序列相关会显著缩短首达时间。模型针对对称双侧边界，不适用于严格单调退化；矩匹配到两点随机游走不保留完整增量分布，且 $k=\\lfloor L/\\delta\\rfloor$ 引入离散边界误差。参数不确定性、非平稳转移核、非对称或移动边界以及高维状态空间尚未纳入理论主结果。

**证明逻辑/大纲**

1. **主张：** 命题 2\.4 证明奇偶修正寿命 $T\_k$ 的递增失效率性质。
   - **路线：** 先按边界宽度的奇偶性构造偶数骨架 $X\_n$ 和奇数骨架 $Y\_n$，显式写出相邻状态的转移概率。对每一对相邻暂态行验证似然比不等式（2\.4）；附录 A 中代数化简表明内部行比值为 $4$，边界行比值为 $2$ 或 $6$，均严格大于 $1$。因此满足 Kijima 的一致单调性条件，吸收时间具有 IFR 性。
2. **主张：** 推论 2\.5 从 IFR 推出生存序列对数凹性和 NBU 性质。
   - **路线：** 令 $r\_k\(n\)=\\overline F\_k\(n\+1\)/\\overline F\_k\(n\)$。IFR 等价于 $r\_k\(n\)$ 非增，因此连续生存比率的乘积给出生存序列的对数凹不等式。对任意年龄 $s$ 和增量 $t$，把条件生存概率写成从 $s$ 开始的比率乘积，再用比率单调性逐项比较到从零开始的乘积，得到 NBU 不等式。
3. **主张：** 第 3 节的次随机矩阵公式把结构寿命和原始有符号状态的 RUL 转化为精确有限维线性代数。
   - **路线：** 对偶数和奇数骨架分别取暂态矩阵 $Q\_\{\\mathrm\{even\}\}$ 和 $Q\_\{\\mathrm\{odd\}\}$，生存概率由初始行向量与矩阵幂作用于全一向量给出，均值由 $\(I-Q\)^\{-1\}$ 的 resolvent 给出。对任意当前有符号状态，构造暂态矩阵 $P\_\{\\mathrm\{sgn\}\}$，其矩阵幂直接给出条件生存概率，求和后得到状态条件均值 RUL。矩匹配公式把观测漂移和方差映射到有效参数 $p$、$\\delta$ 和 $k$。
4. **主张：** 命题 4\.1 和命题 4\.2 将 IFR 结构转化为持久概率包络和最优干预规则。
   - **路线：** 由生存比率非增性，对任意锚点年龄 $n\_0$ 将之后各期比率统一以上限 $r\_k\(n\_0\)$ 替代，得到几何生存上界。随后把预防干预和越界干预的期望成本除以更新周期期望长度，得到成本率 $J\(\\tau\)$。比较相邻年龄的成本差，并用 IFR 把下降条件化为 hazard 与当前平均成本的单次穿越，因此最优年龄可通过一维整数搜索确定。

**排序理由**

正文核查显示该文围绕“奇偶骨架首达动力学与干预优化”给出可复查的具体机制与结论，按与偏微分方程主线的相关性、技术复用性和影响综合评分为 52/100。

**AI 协作披露**

作者明确声明在准备文章期间使用 Gemini 3 进行语言润色；文章内容已由作者审阅和编辑以确保准确性。披露用途限于语言 refinement，未声明 Gemini 3 用于研究设计、数学推导、证明、代码、校对以外的编辑、翻译、排版、图表或插图。

来源：PDF 第 33 页 Declaration of generative AI use；同页相邻的 Acknowledgments、Declaration of interest statement 和 Data availability statement 也已核查。

**原始英文摘要**

Two-sided threshold crossings arise in discrete monitoring systems whenever intervention is triggered by departure from an operating band\. This paper develops a finite-state first-passage framework based on a biased random walk with symmetric absorbing barriers\. To remove parity gaps of the raw hitting time, we analyse a parity-corrected lifetime through even- and odd-state Markov skeletons\. Adjacent-row likelihood-ratio inequalities verify the monotonicity condition and establish increasing failure rate and new-better-than-used properties\. These ageing properties yield log-concave survival probabilities and geometric persistence bounds\. Substochastic-matrix formulas are derived for survival, hazard, mean lifetime, state-conditioned remaining useful life, and finite-horizon crossing risk\. A renewal-cost criterion then converts the first-passage distribution into an optimal preventive-intervention schedule\. Model parameters are obtained by matching the drift and variance of observed increments to a two-point random-walk approximation, with a rolling-window extension for nonstationary regimes\. Numerical experiments compare exact calculations with Monte Carlo diagnostics, moment-matched inverse-Gaussian and Weibull benchmarks, serially correlated increments, calibration perturbations, and fixed-interval policies\. A synthetic remote-patient-monitoring example illustrates how discrete physiological deviations can be mapped to transparent risk scores and personalized review schedules\. The framework provides an auditable link between discrete stochastic dynamics, remaining-lifetime prediction, and condition-based intervention, while separating mathematical validation from clinical validation\.

---
