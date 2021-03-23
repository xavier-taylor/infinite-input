# using pipenv as 'npm equivalent'

https://pipenv.kennethreitz.org/en/latest/install/

- I followed the Isolated install

sudo apt install python3-pip

sudo apt-get install python3-venv

pipx install pipenv

# Installing a dependencies

inside the project folder, ie /nlp, type
pipenv install stanza // ie, to install stanza
This seemed like a combo of npm init and npm install.
It output:
To activate this project's virtualenv, run pipenv shell.
Alternatively, run a command inside the virtualenv with pipenv run.
And generated Pipfile and Pipfile.lock

# importing

require packagename

# running

pipenv run python main.py

# downloading models

I entered projects virtual env then ran a repl:
pipenv shell
python3
Then ran
import stanza
stanza.download('zh')
Which said
2021-03-16 20:25:47 INFO: Finished downloading models and saved to /home/xavier/stanza_resources.
Which downloaded a 600mb model

# watching graphics card:

nvidia-smi -l

# cuda error

on running zh_nlp = stanza.Pipeline('zh')
I got an error:
021-03-16 20:29:48 INFO: "zh" is an alias for "zh-hans"
2021-03-16 20:29:48 INFO: Loading these models for language: zh-hans (Simplified_Chinese):
=========================
| Processor | Package |

---

| tokenize | gsdsimp |
| pos | gsdsimp |
| lemma | gsdsimp |
| depparse | gsdsimp |
| sentiment | ren |
| ner | ontonotes |
=========================

2021-03-16 20:29:48 INFO: Use device: gpu
2021-03-16 20:29:48 INFO: Loading: tokenize
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/stanza/pipeline/core.py", line 128, in **init**
self.processors[processor_name] = NAME_TO_PROCESSOR_CLASS[processor_name](config=curr_processor_config,
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/stanza/pipeline/processor.py", line 155, in **init**
self.\_set_up_model(config, use_gpu)
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/stanza/pipeline/tokenize_processor.py", line 39, in \_set_up_model
self.\_trainer = Trainer(model_file=config['model_path'], use_cuda=use_gpu)
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/stanza/models/tokenization/trainer.py", line 27, in **init**
self.model.cuda()
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/torch/nn/modules/module.py", line 491, in cuda
return self.\_apply(lambda t: t.cuda(device))
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/torch/nn/modules/module.py", line 387, in \_apply
module.\_apply(fn)
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/torch/nn/modules/rnn.py", line 186, in \_apply
self.flatten_parameters()
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/torch/nn/modules/rnn.py", line 172, in flatten_parameters
torch.\_cudnn_rnn_flatten_weight(
RuntimeError: cuDNN error: CUDNN_STATUS_NOT_INITIALIZED021-03-16 20:29:48 INFO: "zh" is an alias for "zh-hans"
2021-03-16 20:29:48 INFO: Loading these models for language: zh-hans (Simplified_Chinese):
=========================
| Processor | Package |

---

| tokenize | gsdsimp |
| pos | gsdsimp |
| lemma | gsdsimp |
| depparse | gsdsimp |
| sentiment | ren |
| ner | ontonotes |
=========================

2021-03-16 20:29:48 INFO: Use device: gpu
2021-03-16 20:29:48 INFO: Loading: tokenize
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/stanza/pipeline/core.py", line 128, in **init**
self.processors[processor_name] = NAME_TO_PROCESSOR_CLASS[processor_name](config=curr_processor_config,
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/stanza/pipeline/processor.py", line 155, in **init**
self.\_set_up_model(config, use_gpu)
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/stanza/pipeline/tokenize_processor.py", line 39, in \_set_up_model
self.\_trainer = Trainer(model_file=config['model_path'], use_cuda=use_gpu)
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/stanza/models/tokenization/trainer.py", line 27, in **init**
self.model.cuda()
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/torch/nn/modules/module.py", line 491, in cuda
return self.\_apply(lambda t: t.cuda(device))
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/torch/nn/modules/module.py", line 387, in \_apply
module.\_apply(fn)
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/torch/nn/modules/rnn.py", line 186, in \_apply
self.flatten_parameters()
File "/home/xavier/.local/share/virtualenvs/nlp-DvhaXbsh/lib/python3.8/site-packages/torch/nn/modules/rnn.py", line 172, in flatten_parameters
torch.\_cudnn_rnn_flatten_weight(
RuntimeError: cuDNN error: CUDNN_STATUS_NOT_INITIALIZED

I have no idea what it means or how to fix it. First took a look at
https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html
tried to install something called CUDA lol
I coudlnt understand the instructions there, so I tried:
$ sudo apt install nvidia-cuda-toolkit

Still not working after all of that. Thought about installing pytorch directly at https://pytorch.org/get-started/locally/
noticed that the supported compute platforms are cude 102. and cuda 11.1, so started downloading 11.1, as I had installed 11.2`

That finally did it. Once I had cuda 11.1 installed and also pytorch directly installed, it finally fucking worked.

(I also installed anaconda but I dont think that helped.)
But interestingly, it still didn't work in pyenv - only in the global python3 environment (perhaps because that is where pytorch had been installed?)

# latest

I deleted pyenv and all that jazz since im not actually using it.
For now, I am just installing my two only dependencies locally like a caveman
