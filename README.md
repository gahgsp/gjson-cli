# GJSON CLI

To install dependencies:

```bash
bun install
```

To run:

```bash
bun render [my-geo-json-file-path]
```

This project was created using `bun init` in bun v1.2.16. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Examples

![polygon-shape-example](assets/polygon-example.png)
<details>
    <summary>GeoJSON Source</summary>

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              21.553846440766222,
              -3.5761219557684285
            ],
            [
              19.364563681482196,
              -5.600557585212471
            ],
            [
              22.402786978643263,
              -5.592681085114265
            ],
            [
              22.44247410755159,
              -7.381646533112374
            ],
            [
              24.449334747149777,
              -7.279393098686725
            ],
            [
              25.925007333045357,
              -6.026734807424532
            ],
            [
              23.434124979442572,
              -5.387358369478122
            ],
            [
              25.663377329188904,
              -4.541687126455926
            ],
            [
              25.5920881742598,
              -3.32278237653
            ],
            [
              23.632476340185207,
              -3.3069692400435713
            ],
            [
              21.545942591061817,
              -3.0138163816034336
            ],
            [
              21.553846440766222,
              -3.5761219557684285
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
}
```

</details>