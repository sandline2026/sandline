import Link from "next/link";
import "../sandline.css";

export default function SizeGuidePage() {
  return (
    <div className="sandline-page">
      <nav>
        <Link className="logo brand-logo-wrap" href="/"><img src="/images/logo-horizontal.png" alt="SANDLINE Resort Wear" className="site-brand-logo" /></Link>
        <div className="nav-links">
          <a href="/shop">Shop</a>
          <a href="/#story">Story</a>
          <a href="/#contact">Contact</a>
        </div>
      </nav>

      <div className="shop-header">
        <h1>Find your fit.</h1>
        <p>Sandline is cut and finished in India. Here's how our sizes translate wherever you're packing for.</p>
      </div>

      <div className="size-guide-wrap">
        <table className="size-table">
          <thead>
            <tr>
              <th>Sandline / India</th>
              <th>US</th>
              <th>UK</th>
              <th>EU</th>
              <th>Bust (in)</th>
              <th>Waist (in)</th>
              <th>Hip (in)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>XS</td>
              <td>0–2</td>
              <td>4–6</td>
              <td>32–34</td>
              <td>32–33</td>
              <td>25–26</td>
              <td>35–36</td>
            </tr>
            <tr>
              <td>S</td>
              <td>4–6</td>
              <td>8–10</td>
              <td>36–38</td>
              <td>34–35</td>
              <td>27–28</td>
              <td>37–38</td>
            </tr>
            <tr>
              <td>M</td>
              <td>8–10</td>
              <td>12–14</td>
              <td>40–42</td>
              <td>36–37</td>
              <td>29–30</td>
              <td>39–40</td>
            </tr>
            <tr>
              <td>L</td>
              <td>12–14</td>
              <td>16–18</td>
              <td>44–46</td>
              <td>38–40</td>
              <td>31–33</td>
              <td>41–43</td>
            </tr>
            <tr>
              <td>XL</td>
              <td>16–18</td>
              <td>20–22</td>
              <td>48–50</td>
              <td>41–43</td>
              <td>34–36</td>
              <td>44–46</td>
            </tr>
          </tbody>
        </table>

        <p className="size-note">
          Measurements are body measurements, not garment measurements. If you're between sizes, we
          recommend sizing up for flowy silhouettes and true-to-size for fitted styles.
        </p>

        <div className="fit-tips">
          <div className="fit-tip">
            <h3>How to measure yourself</h3>
            <p>
              Use a soft measuring tape. Bust: measure around the fullest part. Waist: measure around
              the narrowest part, usually just above the navel. Hip: measure around the fullest part,
              roughly 8" below your waist.
            </p>
          </div>
          <div className="fit-tip">
            <h3>Fabric &amp; fit</h3>
            <p>
              Our silks and rayon blends have a natural drape and slight give. Wrap and tie-front styles
              are forgiving across a size range — check individual product notes for specific fit advice.
            </p>
          </div>
          <div className="fit-tip">
            <h3>Between two sizes?</h3>
            <p>
              For fitted styles (slips, bodycon cuts), we recommend sizing up for comfort. For wrap and
              flow styles, your usual size will work well either way.
            </p>
          </div>
          <div className="fit-tip">
            <h3>Still unsure?</h3>
            <p>
              Message us before you order — send your bust, waist and hip measurements and we'll
              recommend the right size for your chosen style.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
