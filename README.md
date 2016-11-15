# Copyright Evidence Aggregator

Hi! This is an EU Hackathon 2016 project by [Luca Chiarandini](http://grupoweb.upf.edu/~luca.chiarandini/), [Eduardo Graells-Garrido](http://datagramas.cl),
and [Diego Sáez-Trumper](https://scholar.google.es/citations?user=WtSYxGQAAAAJ&hl=es) (Team Bodoques).

### Resources

  * The python folder includes script to scrape data from the Copyright Evidence Wiki, as 
  well as Jupyter Notebooks to parse and process the dataset.
  * The visual_exploration folder contains the complete website presented at the hackathon.
  The website runs completely on HTML and Javascript - no database nor dynamic pages needed!
  
### To run the project

```
$ cd visual_exploration
$ python -m SimpleHTTPServer

or

$ python -m http.server
```
  
### Credits

  * Javascript Stack: [SIMILE Exhibit](http://www.simile-widgets.org/exhibit3/), which we used this faceted exploration library in Javascript to 
  explore the Copyright Evidence Wiki dataset; [d3.js](http://d3js.org), used to build the visualization;
  and [datagramas](https://github.com/carnby/datagramas), from which we used some glue code and bundled libraries like [d3-legend](http://d3-legend-v3.susielu.com/).
  * Scientific stack: [Jupyter Notebooks](http://jupyter.org/), [pandas](http://pandas.pydata.org/), 
  [gensim](http://radimrehurek.com/gensim/), [Python NLTK](http://www.nltk.org/).
  
### License

**The MIT License (MIT)**

Copyright (c) 2016 Luca Chiarandini, Eduardo Graells-Garrido,
and Diego Sáez-Trumper

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.